import { SurveySubmissions } from "$lib/models.js";

/*

Each function accepts a general request object that contains the following properties:
 - request - the general HTTP request. Contains info like body, method, headers, etc...
 - url - referring url, origin, protocol, username and password
 - params - these are the query parameters passed in the url
 - locals - contains any data stored in 'event.locals.' - see /src/hooks/js for example on userid
 - platform - not sure what this is yet

The return object should be a standard HTTP response object including at least { status: XXX }

*/

// Public API that saves a test result

export async function get({ request }) {

    const surveys = await SurveySubmissions.find({}).exec();

    if (surveys) {
        return {
            status: 201,
            body: { surveys }
        }
    } else {
        return {
            status: 404,
            body: "No surveys found",
        };
    }

}

export async function post({ request, url, params, locals, platform }) {

    try {

        const data = await request.json();

        newSurvey = new SurveySubmissions(data);
        saved = await newSurvey.save();

        if (saved === newSurvey) {
            return {
                status: 200,
                body: JSON.stringify({
                    resp: "Data saved successfully",
                    entryId: newSurvey._id,
                }),
            };
        } else {
            return {
                status: 500,
                resp: JSON.stringify({
                    resp: "Problem saving data",
                }),
            };
        }

    } catch (error) {
        return {
            status: 500,
            body: JSON.stringify(error),
        };
    }
    
        
    
}
  