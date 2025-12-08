import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory, sessionId } = await req.json();

    // URL de votre webhook n8n
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://votre-n8n-instance.com/webhook/chat';
    
    // Générer ou utiliser le sessionId existant
    // Pour Simple Memory de n8n, on a besoin d'un sessionId
    const finalSessionId = sessionId || 'user-session-' + Date.now();
    
    console.log('🔵 Envoi à n8n:', { url: N8N_WEBHOOK_URL, message, sessionId: finalSessionId });
    
    // Préparer le payload pour n8n avec sessionId pour Simple Memory
    const payload = {
      sessionId: finalSessionId,  // Requis par Simple Memory
      chatInput: message,         // Le message de l'utilisateur
      // conversationHistory,     // Simple Memory gère ça automatiquement
    };
    
    console.log('📤 Payload envoyé:', JSON.stringify(payload, null, 2));
    
    // Appel à n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si vous avez une clé API n8n, ajoutez-la ici
        // 'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('📥 Réponse n8n status:', response.status, response.statusText);

    if (!response.ok) {
      // Essayer de récupérer le corps de l'erreur pour plus de détails
      let errorDetails = '';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody;
        console.error('❌ Erreur n8n détails:', errorBody);
      } catch (e) {
        console.error('❌ Impossible de lire le corps de l\'erreur');
      }
      
      throw new Error(`Erreur n8n: ${response.status} ${response.statusText}${errorDetails ? ' - ' + errorDetails : ''}`);
    }

    const data = await response.json();
    
    console.log('✅ Réponse n8n data:', JSON.stringify(data, null, 2));
    
    // n8n retourne un tableau: [{ "output": "..." }]
    let assistantMessage = '';
    
    if (Array.isArray(data) && data.length > 0 && data[0].output) {
      // Format: [{ "output": "réponse" }]
      assistantMessage = data[0].output;
    } else if (data.output) {
      // Format: { "output": "réponse" }
      assistantMessage = data.output;
    } else if (data.response) {
      // Format: { "response": "réponse" }
      assistantMessage = data.response;
    } else if (data.message) {
      // Format: { "message": "réponse" }
      assistantMessage = data.message;
    } else {
      // Fallback: utiliser la réponse complète
      assistantMessage = typeof data === 'string' ? data : JSON.stringify(data);
    }
    
    console.log('💬 Message extrait:', assistantMessage);
    
    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sessionId: finalSessionId,  // Retourner le sessionId pour référence
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

