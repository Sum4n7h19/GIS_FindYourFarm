import geopandas as gpd
import pandas as pd
from shapely import wkt
import requests
import json

def parcel(villageid, parcelno):
    url = f"https://kgis.ksrsac.in:9000/genericwebservices/ws/geomForSurveyNum/{villageid}/{parcelno}/UTM"
    response = requests.get(url, verify = False)
    df = json.loads(response.text)
    gdf= gpd.GeoDataFrame(df)
    gdf['geometry'] = gdf['geom'].apply(wkt.loads)
    gdf.set_crs(32643, allow_override=True)
    return gdf


import leafmap
m = leafmap.Map()
m.add_gdf(parcel(626,3), layer_name="parcelno")
print(m)