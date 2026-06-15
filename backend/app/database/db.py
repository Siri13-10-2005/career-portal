from pymongo import MongoClient
import certifi

MONGO_URL = "mongodb+srv://siriammathi13_db_user:wglXz6BaOSlHRFBn@clustersiri.pzlqr6m.mongodb.net/?appName=ClusterSiri"
client = MongoClient(
    MONGO_URL,
    tlsCAFile=certifi.where()
)

db = client["career_portal"]