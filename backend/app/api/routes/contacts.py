from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Contact, Company
from app.schemas.domain import ContactOut, CompanyOut

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.get("", response_model=List[ContactOut])
async def list_contacts(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Contact).order_by(Contact.first_name))
    contacts = res.scalars().all()
    
    for c in contacts:
        if c.company_id:
            comp_res = await db.execute(select(Company).where(Company.id == c.company_id))
            c.company = comp_res.scalars().first()
            
    return contacts

@router.get("/{contact_id}", response_model=ContactOut)
async def get_contact(contact_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = res.scalars().first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    if contact.company_id:
        comp_res = await db.execute(select(Company).where(Company.id == contact.company_id))
        contact.company = comp_res.scalars().first()
        
    return contact
