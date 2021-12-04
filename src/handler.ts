export async function handleRequest(request: Request): Promise<Response> {


    //return new Response( "Regain sanity 01" );


    // Parse the code parameter out of the URL
    const { searchParams } = new URL(request.url)
    const oauth_code:string|null = searchParams.get('code')

    // If we didn't get a code param, bail out
    if ( oauth_code === null ) {
        return new Response( "No query parameter named 'code' present", 
            {
                status: 400,
            }
        )
    }

    const cognitoSubId:string = "f803355d-4396-4b79-b7b8-d887402b25cd"
    const flickrGroupAddrSessionId:string = "0b48936d-cc79-487f-a1e6-289373450c93"
    
    // Set these values in cookies, then redirect to Flickr auth


    //return new Response( "Cognito sub ID: " + cognitoSubId + "\n\nSession ID: " + flickrGroupAddrSessionId);
    const redirectUrl:string = "https://flickrgroupaddr.com/flickr-auth.html"
    const redirectStatusCode:number = 301
    let callbackResponse:Response = new Response(
        "",
        {
            "status"    : redirectStatusCode,
            "headers"   : {
                "location"      : redirectUrl,
                "set-cookie"    : "FGA_COGNITO_SUB_ID=" + cognitoSubId + "; Max-Age: 604800; Domain=flickrgroupaddr.com; Path=/; Secure; SameSite=None",
            }
        }
    )

    return callbackResponse

    //return Response.redirect( redirectUrl, redirectStatusCode )
}


async function exchangeCodeForToken( oauth_code: string ): Promise<string> {

    // Exchange the oauth code for a token

    const tokenUrl:string = "https://login.flickrgroupaddr.com/oauth2/token"

    const authHeaderValue:string = "Basic " + btoa( `${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}` )
    let formHeaders = new Headers()
    formHeaders.append( 'Authorization', authHeaderValue )
    formHeaders.append( 'Content-Type', 'application/x-www-form-urlencoded' )

    /*
     * Don't need to set content type. Fetch API says if you pass a 
     *      URLSearchParams object as the body, the content type
     *      is automatically set to "application/x-www-form-urlencoded"
     */

    let formBody = new URLSearchParams();
    formBody.append( 'grant_type',      'authorization_code' )
    formBody.append( 'client_id',       'hpc8p0fu5ke50v6ft8h1ti37f' )
    formBody.append( 'code',            oauth_code )
    formBody.append( 'redirect_uri',    'https://auth.flickrgroupaddr.com/oauth/callback' )

    //return new Response("Sanity check 03" )


    const fetchResponse = await fetch( 
        "https://login.flickrgroupaddr.com/oauth2/token", 
        {
            //method          : 'POST',
            //headers         : formHeaders,
            //body            : formBody,
            //redirect        : 'manual',
        }
    )

    //return new Response("Sanity check 04" )


    const resultText = await fetchResponse.text();
    //const string_result:string = JSON.stringify(result)

    const responseHeaders = fetchResponse.headers;
    let headersValues:{ [key:string]: string } = { }
    for ( let headerPair of responseHeaders ) {
        headersValues[ headerPair[0] ] = headerPair[1] 
        //console.log( "Header key = " + headerPair[0] + ", header value = " + headerPair[1] );
    }

    return  "Auth header: \"Authorization: " + authHeaderValue + "\"\n\nBody:\n" + formBody.toString() + "\n\nToken endpoint response\n\nHeaders:\n" + JSON.stringify(headersValues) + "\n\nBody:\n" + resultText

    //return new Response(`OAuth code: ${oauth_code}, client id: ${OAUTH_CLIENT_ID}`)
    //return new Response(`Code: ${oauth_code}, auth header = ${auth_header}, request_body=${request_body}` )
}
