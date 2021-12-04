export async function handleRequest(request: Request): Promise<Response> {
    // Parse the code parameter out of the URL
    const { searchParams } = new URL(request.url)
    const oauth_code:string|null = searchParams.get('code')


    // Exchange the oauth code for a token

    // Global variables with secrets we need:
    //      OAUTH_CLIENT_ID
    //      OAUTH_CLIENT_SECRET
     

    //return new Response(`OAuth code: ${oauth_code}, client id: ${OAUTH_CLIENT_ID}`)
    return new Response(`Code: ${oauth_code}` )
}
