import { json as json$1 } from '@sveltejs/kit';
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

export async function GET({ request }) {

    const surveys = await SurveySubmissions.find({}).exec();

    if (surveys) {
        return new Response(JSON.stringify(surveys), { status: 201 });
    } else {
        return new Response("No surveys found", { status: 404 });
    }

}

export async function POST({ request, url, params, locals, platform }) {
    console.log('New Survey Submission');

    try {

        const data = await request.json();
        const newSurvey = new SurveySubmissions(data);
        const saved = await newSurvey.save();
        
        if (saved === newSurvey) {
            return new Response(JSON.stringify({
                resp: "Data saved successfully",
                entryId: newSurvey._id,
            }));
        } else {
            console.log('unexpected error in /Survey POST');
            console.log('saved');
            console.log(saved);
            console.log('newSurvey');
            console.log(newSurvey);
            return new Response({msg: 'survey not saved'}, { status: 500 });
        }

    } catch (error) {
        console.log('Error in /Survey POST');
        console.log(error);
        return new Response({msg: JSON.stringify(error)}, { status: 500 });
    }
    
        
    
}

// export async function DELETE({ request }) {
//     SurveySubmissions.deleteMany({}).exec();
// }