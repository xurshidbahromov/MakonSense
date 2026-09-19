from datetime import datetime
from sqlalchemy import Column, BigInteger, Integer, String, Text, DateTime
from app.core.database import Base


class POI(Base):
    __tablename__ = "pois"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    osm_id = Column(BigInteger, unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    sub_category = Column(String(100), nullable=True)
    brand = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    # Stored as WKT or native PostGIS geometry
    h3_index_res9 = Column(String(15), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


class TransitStop(Base):
    __tablename__ = "transit_stops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    transit_type = Column(String(50), nullable=False)  # 'metro_station', 'bus_terminal', 'major_hub'
    line_name = Column(String(100), nullable=True)
    passenger_flow_score = Column(Integer, default=50)


class ResidentialComplex(Base):
    __tablename__ = "residential_complexes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    developer = Column(String(150), nullable=True)
    units_count = Column(Integer, default=0)
    completion_year = Column(Integer, nullable=True)
    status = Column(String(50), default="completed")
