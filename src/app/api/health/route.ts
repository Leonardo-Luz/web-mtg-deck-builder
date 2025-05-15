export const GET = async () => {
    return new Response(JSON.stringify({ health_check: 'OK' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
