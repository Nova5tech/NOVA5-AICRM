from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Ticket, Contact, Conversation
from app.schemas.domain import TicketOut, TicketCreate

router = APIRouter(prefix="/tickets", tags=["Support Tickets & SLAs"])

@router.get("", response_model=List[TicketOut])
async def list_tickets(status: Optional[str] = None, priority: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Ticket)
    if status:
        stmt = stmt.where(Ticket.status == status)
    if priority:
        stmt = stmt.where(Ticket.priority == priority)
    stmt = stmt.order_by(Ticket.created_at.desc())

    res = await db.execute(stmt)
    tickets = res.scalars().all()

    for t in tickets:
        cnt_res = await db.execute(select(Contact).where(Contact.id == t.contact_id))
        t.contact = cnt_res.scalars().first()

    return tickets

@router.post("", response_model=TicketOut)
async def create_ticket(ticket_in: TicketCreate, db: AsyncSession = Depends(get_db)):
    new_ticket = Ticket(
        id=f"tkt_{uuid.uuid4().hex[:8]}",
        contact_id=ticket_in.contact_id,
        conversation_id=ticket_in.conversation_id,
        title=ticket_in.title,
        issue_description=ticket_in.issue_description,
        status="Open",
        priority=ticket_in.priority,
        assignee_id=ticket_in.assignee_id,
        sla_due_hours=ticket_in.sla_due_hours,
        ai_summary=f"AI Summarized Support Issue: {ticket_in.title}",
        ai_suggested_resolution="Verify customer vector database tenant permissions and send technical resolution guide."
    )
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)

    cnt_res = await db.execute(select(Contact).where(Contact.id == new_ticket.contact_id))
    new_ticket.contact = cnt_res.scalars().first()
    return new_ticket

@router.patch("/{ticket_id}/status")
async def update_ticket_status(ticket_id: str, status: str = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    tkt = res.scalars().first()
    if not tkt:
        raise HTTPException(status_code=404, detail="Ticket not found")

    tkt.status = status
    await db.commit()
    await db.refresh(tkt)
    return {"status": "success", "ticket_id": tkt.id, "new_status": tkt.status}
