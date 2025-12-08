import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    
    if (!N8N_WEBHOOK_URL) {
      throw new Error('N8N_WEBHOOK_URL non configurée');
    }

    const finalSessionId = sessionId || `session-${Date.now()}`;
    
    const payload = {
      sessionId: finalSessionId,
      chatInput: message,
    };
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('Erreur n8n:', response.status, errorBody);
      throw new Error(`Erreur n8n: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraction du message selon le format n8n
    let assistantMessage = '';
    
    if (Array.isArray(data) && data.length > 0 && data[0].output) {
      assistantMessage = data[0].output;
    } else if (data.output) {
      assistantMessage = data.output;
    } else if (data.response) {
      assistantMessage = data.response;
    } else if (data.message) {
      assistantMessage = data.message;
    } else {
      assistantMessage = typeof data === 'string' ? data : JSON.stringify(data);
    }
    
    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sessionId: finalSessionId,
    });

  } catch (error) {
    console.error('Erreur lors de l\'appel à n8n:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la communication avec le serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

