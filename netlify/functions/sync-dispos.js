export default async function handler(req, context) {
  const { getStore } = await import('@netlify/blobs');

  try {
    const store = getStore('global');

    // Appel du script externe
    const res = await fetch('https://script.google.com/macros/s/AKfycbzlnJvSYcleBQ_l2z5vUSmksQTtVE0kxYLUwMQ_N1avWEezKWwBeGsiOc579qOlMj5cGg/exec?path=dispos');
    if (!res.ok) {
      throw new Error(`Erreur API externe (${res.status})`);
    }

    // Parse JSON
    const dispos = await res.json();

    // Enregistrement dans le store Netlify
    await store.set("dispo.json", JSON.stringify(dispos));

    // Réponse correcte pour Netlify
    return new Response(
      JSON.stringify({ ok: true, totalDays: Object.keys(dispos).length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("sync-dispos failed:", error);

    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


