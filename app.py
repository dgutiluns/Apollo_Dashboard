import pandas as pd
import re
from pymongo import MongoClient
from datetime import datetime
import certifi
from flask import Flask, request, jsonify
from flask_cors import CORS

# MongoDB connection URI
uri = "mongodb+srv://rpastats-db-user:f96Qre8N6rdEv5jN@cluster0.faesqk0.mongodb.net/rpastats?ssl=true&serverSelectionTimeoutMS=7000&connectTimeoutMS=30000&maxIdleTimeMS=600000"
client = MongoClient(uri, tlsCAFile=certifi.where())
db = client['rpastats']
collection = db['RpaStat']

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def query_db(company_name=None, start_date=None, end_date=None):
    query = {}
    if company_name:
        query['Customer'] = company_name
    if start_date and end_date:
        try:
            start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
            query['Timestamp'] = {'$gte': start_date_dt, '$lte': end_date_dt}
        except ValueError as e:
            print("Date format error:", e)
            return pd.DataFrame()

    try:
        documents = list(collection.find(query))
        if not documents:
            print("No records found for the given query.")
            return pd.DataFrame()
        return pd.DataFrame(documents)
    except Exception as e:
        print("Error during database query:", e)
        return pd.DataFrame()

@app.route('/api/customers', methods=['GET'])
def get_customers():
    try:
        customers = collection.distinct('Customer')
        return jsonify({"customers": customers})
    except Exception as e:
        print("Error fetching customers:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/bots', methods=['GET'])
def get_bots():
    customer_name = request.args.get('customer_name')
    try:
        if customer_name:
            bots = collection.distinct('Bot', {'Customer': customer_name})
        else:
            bots = collection.distinct('Bot')
        return jsonify({"bots": bots})
    except Exception as e:
        print("Error fetching bots:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/report', methods=['GET'])
def get_report():
    company_name = request.args.get('company_name')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    report = company_monthly_report(company_name, start_date, end_date)
    return report.to_json()

def company_monthly_report(company_name, start_date, end_date):
    df = query_db(company_name, start_date, end_date)

    if df.empty:
        return df

    df['Timestamp'] = df['Timestamp'].astype(str)
    df['Customer'] = df['Customer'].str.lower()

    corrections = {
        'autoboys': 'autoboys',
        'auto boys': 'autoboys',
        'autoboyz': 'autoboys',
        'auto boys inc': 'autoboys',
        'discovery': 'discovery',
        'bidvest mccarthy': 'bidvest mccarthy',
        'bidvest  mccarty': 'bidvest mccarthy',
        'legal guard': 'legal guard',
        'pupekwitz megabuild': 'pupekwitz megabuild',
        'dis' : 'discovery',
    }
    df['Customer'] = df['Customer'].replace(corrections)

    company_name_normalized = company_name.lower()
    filtered_df = df[df['Customer'] == company_name_normalized]

    monthly_df = filtered_df[(filtered_df['Timestamp'].str[:10] >= start_date) & (filtered_df['Timestamp'].str[:10] <= end_date)].copy()

    def categorize_status(status):
        status_lower = status.lower()
        if 'incomplete' in status_lower or 'incomplete - business rule exception' in status_lower or 'incomplete ' in status_lower or 'query' in status_lower or 'business exception' in status_lower or 'technical exception' in status:
            return 'Business Exception'
        elif 'bot processing completed' in status_lower:
            return 'Other'
        elif 'complete' in status_lower or 'complete ' in status_lower or 'completed' in status_lower or 'bot processing completed' in status_lower:
            return 'Complete'
        elif 'processing' in status_lower or 'data retrieved - processing' in status_lower:
            return 'Processing'
        elif 'error' in status_lower:
            return 'Error' 
        else:
            return 'Other'

    monthly_df['Status'] = monthly_df['Status'].apply(categorize_status)

    monthly_grouped_df = monthly_df.groupby(['Customer', 'Bot', 'Status']).size().reset_index(name='Count')

    monthly_pivot_df = monthly_grouped_df.pivot(index=['Customer', 'Bot'], columns='Status', values='Count').fillna(0)

    monthly_pivot_df['Error'] = monthly_pivot_df['Processing'] - (monthly_pivot_df['Complete'] + monthly_pivot_df['Business Exception'])

    if 'Processing' in monthly_pivot_df.columns:
        monthly_pivot_df['DTD Transactions'] = monthly_pivot_df['Processing']
    else:
        monthly_pivot_df['DTD Transactions'] = 0

    if 'Complete' in monthly_pivot_df.columns:
        monthly_pivot_df['DTD Transactions Processed'] = monthly_pivot_df['Complete']
    else:
        monthly_pivot_df['DTD Transactions Processed'] = 0

    if 'Business Exception' in monthly_pivot_df.columns:
        monthly_pivot_df['DTD Business Exceptions'] = monthly_pivot_df['Business Exception']
    else:
        monthly_pivot_df['DTD Business Exceptions'] = 0

    if 'Error' in monthly_pivot_df.columns:
        monthly_pivot_df = monthly_pivot_df.rename(columns={'Error': 'DTD Transactions Failed'})
    else:
        monthly_pivot_df['DTD Transactions Failed'] = 0

    if 'Processing' in monthly_pivot_df.columns and 'Complete' in monthly_pivot_df.columns:
        monthly_pivot_df['DTD Success (%)'] = (monthly_pivot_df['Complete'] / monthly_pivot_df['Processing']) * 100
    else:
        monthly_pivot_df['DTD Success (%)'] = 0

    monthly_pivot_df.drop(columns=['Complete', 'Processing'], inplace=True, errors='ignore')

    monthly_pivot_df['DTD Transactions Failed'] = monthly_pivot_df['DTD Transactions Failed'].apply(lambda x: 0 if x < 0 else x)

    def format_percentages(x):
        try:
            return f"{x:.3g}" if pd.notna(x) else 'n/a'
        except ValueError:
            return x

    for column in monthly_pivot_df.columns:
        if '(%)' in column:
            monthly_pivot_df[column] = monthly_pivot_df[column].apply(format_percentages)

    row_count = len(monthly_df)
    print(f"Number of bot activities from {start_date} to {end_date} for company '{company_name.capitalize()}': {row_count}")
    print("All n/a values mean that the bot was not used in the month that was inputted.")
    
    return monthly_pivot_df

if __name__ == '__main__':
    app.run(debug=True)
