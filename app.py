from flask import Flask, request, jsonify, render_template, url_for
import pandas as pd
import os

app = Flask(__name__)

data_file = 'data1.csv'

if not os.path.isfile(data_file):
    raise FileNotFoundError(f"The file {data_file} does not exist. Please check the file path.")

data = pd.read_csv(data_file)

def recommend_destinations(user_preferences):
    def check_preference(values, preference):
        if isinstance(values, str):
            return preference in values.split(", ")
        return False

    filtered_data = data[
        data['Theme'].apply(lambda x: check_preference(x, user_preferences['theme'])) &
        data['Budget'].apply(lambda x: check_preference(x, user_preferences['budget'])) &
        data['Travel_Companions'].apply(lambda x: check_preference(x, user_preferences['travel_companions']))
    ]

    if len(filtered_data) > 0:
        recommendations = filtered_data.to_dict('records')
        for rec in recommendations:
            rec['Image_Link'] = url_for('static', filename=f'img/{rec["Image_Link"]}')
        return recommendations
    else:
        return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    user_preferences = request.json
    recommendations = recommend_destinations(user_preferences)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)