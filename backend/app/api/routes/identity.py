from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Contact, Company
from app.schemas.domain import ContactOut, DuplicateMatch, MergeContactsRequest

router = APIRouter(prefix="/identity", tags=["Customer Identity Resolution"])

@router.get("/duplicates", response_model=List[DuplicateMatch])
async def detect_duplicates(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Contact).where(Contact.is_merged == False))
    contacts = res.scalars().all()

    duplicates = []
    # Identify duplicate pairs matching last name or domain or phone
    for i in range(len(contacts)):
        for j in range(i + 1, len(contacts)):
            c1, c2 = contacts[i], contacts[j]
            match_reason = None
            confidence = 0

            if c1.email and c2.email and c1.email.split('@')[-1] == c2.email.split('@')[-1]:
                match_reason = f"Shared Company Email Domain (@{c1.email.split('@')[-1]})"
                confidence = 88
            elif c1.last_name.lower() == c2.last_name.lower():
                match_reason = f"Identical Last Name ({c1.last_name})"
                confidence = 82

            if match_reason:
                # Load company details
                if c1.company_id:
                    comp_res1 = await db.execute(select(Company).where(Company.id == c1.company_id))
                    c1.company = comp_res1.scalars().first()
                if c2.company_id:
                    comp_res2 = await db.execute(select(Company).where(Company.id == c2.company_id))
                    c2.company = comp_res2.scalars().first()

                duplicates.append(DuplicateMatch(
                    contact1=c1,
                    contact2=c2,
                    match_reason=match_reason,
                    confidence_score=confidence
                ))

    return duplicates

@router.post("/merge")
async def merge_contacts(req: MergeContactsRequest, db: AsyncSession = Depends(get_db)):
    res1 = await db.execute(select(Contact).where(Contact.id == req.primary_contact_id))
    primary = res1.scalars().first()

    res2 = await db.execute(select(Contact).where(Contact.id == req.secondary_contact_id))
    secondary = res2.scalars().first()

    if not primary or not secondary:
        raise HTTPException(status_code=404, detail="Primary or secondary contact not found")

    secondary.is_merged = True
    secondary.merged_into_id = primary.id

    # Combine channel handles
    merged_handles = {**secondary.channel_handles, **primary.channel_handles}
    primary.channel_handles = merged_handles

    await db.commit()
    return {"status": "success", "merged_primary_id": primary.id, "secondary_id": secondary.id}
