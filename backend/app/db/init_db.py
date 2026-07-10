from app.db.database import engine, Base

import app.models.tenant
import app.models.branch

Base.metadata.create_all(bind=engine)

print("Database initialized successfully")
