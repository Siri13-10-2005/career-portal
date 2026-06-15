from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)


MONGO_URL = os.getenv("MONGO_URL")



client = MongoClient(
    MONGO_URL,
    tlsCAFile=certifi.where()
)

db = client["career_portal"]