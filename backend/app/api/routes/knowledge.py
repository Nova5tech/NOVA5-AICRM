from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Document
from app.schemas.domain import DocumentOut, DocumentCreate
from app.ai.engine import AIRAGEngine

router = APIRouter(prefix="/knowledge", tags=["RAG Knowledge Base"])

@router.get("", response_model=List[DocumentOut])
async def list_documents(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Document).order_by(Document.created_at.desc()))
    return res.scalars().all()

@router.post("", response_model=DocumentOut)
async def upload_document(doc: DocumentCreate, db: AsyncSession = Depends(get_db)):
    new_doc = Document(
        id=f"doc_{uuid.uuid4().hex[:8]}",
        title=doc.title,
        category=doc.category,
        content=doc.content,
        chunk_count=max(1, len(doc.content) // 200),
        status="Indexed"
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    return new_doc

@router.get("/search")
async def search_knowledge(q: str = Query(..., description="Query string for RAG vector search"), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Document))
    docs = [d.__dict__ for d in res.scalars().all()]
    results = AIRAGEngine.search_docs(docs, q)
    return {"query": q, "matched_chunks": results}
