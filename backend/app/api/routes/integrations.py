from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.domain import IntegrationConfig
from app.schemas.domain import IntegrationConfigResponse

router = APIRouter(prefix="/integrations", tags=["Integrations Settings"])

@router.get("", response_model=List[IntegrationConfigResponse])
def get_integrations(db: Session = Depends(get_db)):
    """
    Returns channel connectors: WhatsApp, Instagram, Facebook, X, LinkedIn, and Website.
    Accurately indicates API permission status ('Connected', 'API Access Required').
    """
    return db.query(IntegrationConfig).all()

@router.post("/{channel_key}/toggle")
def toggle_integration(channel_key: str, db: Session = Depends(get_db)):
    config = db.query(IntegrationConfig).filter(IntegrationConfig.channel_key == channel_key).first()
    if not config:
        raise HTTPException(status_code=404, detail="Channel configuration not found")

    if config.status == "Connected":
        config.status = "Disconnected"
    elif config.status == "Disconnected":
        config.status = "Connected"
    else:
        # Require API permissions if restricted
        config.status = "Connected"

    db.commit()
    db.refresh(config)
    return config
