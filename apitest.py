from flask import Flask, send_file
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import geopandas as gpd
from shapely import wkt
import requests
import json
import matplotlib.pyplot as plt
from io import BytesIO

app = Flask(__name__)
CORS(app) 
api = Api(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456789@localhost/parcel'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Define the Parcel model
class Parcel(db.Model):
    Event_id = db.Column(db.Integer, primary_key=True)
    KGISVillageID = db.Column(db.Integer, primary_key=False)
    KGISStateID = db.Column(db.Integer, nullable=False)
    KGISStateName = db.Column(db.String(300), nullable=False)
    KGISDistrictID = db.Column(db.Integer, nullable=False)
    KGISDistrictName = db.Column(db.String(300), nullable=False)
    KGISTalukID = db.Column(db.Integer, nullable=False)
    KGISTalukName = db.Column(db.String(300), nullable=False)
    KGISHobliID = db.Column(db.Integer, nullable=False)
    KGISHobliName = db.Column(db.String(300), nullable=False)
    KGISVillageName = db.Column(db.String(300), nullable=False)

# Resource to handle GET requests for parcel data
class ParcelNo(Resource):
    def get(self):
        parcels = Parcel.query.all()
        parcel_list = []
        for parcel in parcels:
            parcel_data = {
                'Event_id': parcel.Event_id,
                'KGISVillageID': parcel.KGISVillageID,
                'KGISStateID': parcel.KGISStateID,
                'KGISStateName': parcel.KGISStateName,
                'KGISDistrictID': parcel.KGISDistrictID,
                'KGISDistrictName': parcel.KGISDistrictName,
                'KGISTalukID': parcel.KGISTalukID,
                'KGISTalukName': parcel.KGISTalukName,
                'KGISHobliID': parcel.KGISHobliID,
                'KGISHobliName': parcel.KGISHobliName,
                'KGISVillageName': parcel.KGISVillageName,
            }
            parcel_list.append(parcel_data)
        return parcel_list

# Resource to handle multiple URL converter
class parcelapi(Resource):
    def get(self, villageID, surveyNO):
        data = "https://kgis.ksrsac.in:9000/genericwebservices/ws/geomForSurveyNum/" \
            + str(villageID) \
            + '/' \
            + str(surveyNO) \
            + '/' \
            + 'UTM'
        response = requests.get(data, verify=False)
        response.raise_for_status()
        df = json.loads(response.text)
        gdf = gpd.GeoDataFrame(df)
        gdf['geometry'] = gdf['geom'].apply(wkt.loads)
        gdf['area'] = gdf.geometry.area/4047
        gdf['perimeter'] = gdf.geometry.length/1000
        gdf = gdf.set_crs(32643, allow_override=True)
        del gdf['geom']
        del gdf['message']
        gdf1 = gdf.to_crs(4326).__geo_interface__
        totalarea = gdf['area'].sum()
        area = [totalarea]
        totalperimeter =  gdf['perimeter'].sum()
        perimeter =[totalperimeter]
        totalarea = gdf['area'].sum()
        area = [round(totalarea,4)]
        totalperimeter = gdf['perimeter'].sum()
        perimeter = [round(totalperimeter,4)]
        return [gdf1,data, area, perimeter]
class ImageGenerator(Resource):
    def get(self, villageID, surveyNO):
        data = "https://kgis.ksrsac.in:9000/genericwebservices/ws/geomForSurveyNum/" \
            + str(villageID) \
            + '/' \
            + str(surveyNO) \
            + '/' \
            + 'UTM'
        response = requests.get(data, verify=False)
        response.raise_for_status()
        df = json.loads(response.text)
        gdf = gpd.GeoDataFrame(df)
        gdf['geometry'] = gdf['geom'].apply(wkt.loads)
        gdf['area'] = gdf.geometry.area/4047
        gdf['perimeter'] = gdf.geometry.length/1000
        gdf = gdf.set_crs(32643, allow_override=True)
           # ploting
        fig, ax = plt.subplots(figsize=(8, 8))
        gdf.plot(ax=ax, color='lightblue', edgecolor='black')

        for idx, row in gdf.iterrows():
            centroid = row['geometry'].centroid
            ax.text(centroid.x, centroid.y + 1, f"{row['area']:.2f} Acre", fontsize=6, ha='center', va='center')
            ax.text(centroid.x, centroid.y - 12, f"{row['perimeter']:.2f} km", fontsize=6, ha='center', va='center')

        arrow_length = 0.02
        # Adjust the xy and xytext coordinates to place the arrow on the left corner
        ax.annotate('N', xy=(0.95, 0.95), xytext=(0.95, 0.90 - arrow_length),
                    arrowprops=dict(facecolor='black', shrink=0.05),
                    fontsize=12, ha='center', va='center', xycoords='axes fraction', textcoords='axes fraction')

        plt.xticks(rotation=90)
        plt.title(f'Survey Number: {surveyNO}')
        plt.xlabel('Easting')
        plt.ylabel('Northing')
        plt.show()

        image_stream = BytesIO()
        plt.savefig(image_stream, format='png')
        image_stream.seek(0)
        plt.close()

        return send_file(image_stream, mimetype='image/png', as_attachment=True, download_name='plot.png')

# Add resources to the API
api.add_resource(ParcelNo, '/parcel')
api.add_resource(parcelapi, '/parcelapi/<int:villageID>/<int:surveyNO>')
api.add_resource(ImageGenerator,'/downloads/<int:villageID>/<int:surveyNO>')

# Main Driver Function
if __name__ == '__main__':
    app.run(debug=True)
