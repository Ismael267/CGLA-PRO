from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING, List

# Import conditionnel pour éviter les imports circulaires
if TYPE_CHECKING:
    from .user import User
    from .car_wash import CarWash
    from .stock_history import StockHistory


class StockManagmentBase(SQLModel):
    station_id: int = Field(foreign_key="car_wash.id", nullable=False)
    owner_id: int = Field(foreign_key="user.id", nullable=False)
    name: str = Field(unique=True, nullable=False)
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[float] = Field(ge=0)
    unit: str = Field(default="unit")  # ex. "litre", "pièce"
    quantity: int = Field(default=0, ge=0)  # Quantité en stock
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class StockManagmentCreate(StockManagmentBase):
    name: str = Field(unique=True, nullable=False)
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[float] = Field(ge=0)
    unit: str = Field(default="unit")  # ex. "litre", "pièce"
    quantity: int = Field(default=0, ge=0)  # Quantité en stock
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class StockManagmentQuantityUpdate(SQLModel):
    quantity: int = Field(ge=0)

class StockManagmentUpdate(SQLModel):
    quantity: Optional[int] = None
    last_updated: Optional[datetime] = None

class StockManagment(StockManagmentBase, table=True):
    __tablename__ = "stock_managments"
    id: Optional[int] = Field(default=None, primary_key=True)
    owner: "User" = Relationship(back_populates="stocks")
    station: "CarWash" = Relationship(back_populates="stocks")
    history: "StockHistory" = Relationship(back_populates="stocks", sa_relationship_kwargs={"cascade": "all, delete-orphan"})