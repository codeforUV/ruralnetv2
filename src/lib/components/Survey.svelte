<script>
  import { currentTest } from "$lib/stores";
  import { page } from "$app/stores";

  export let submitted = false;
  // Initialize memory for variables
  let questionNumber = 0;
  let message = null;
  let allQuestionsAnswered = false;

  //temporary storage for checkbox answers; needed because something weird is happening with the data bindings
  let usesCheckboxAnswers = [];

  //survey questions and answer options
  let surveyInfo = [
    {
      questionId: 1,
      question: "When you connect to the internet at home, do you:",
      answerName: "connection",
      answerType: "radio",
      answerOptions: [
        "Connect to your home Wi-Fi (typical for laptop, tablet or phone)",
        "Connect your computer to your router with a cable (typical for desktop computer)",
        "Set up your phone as a Wi-Fi hotspot (if you don't have home internet, but use cell phone for internet)",
        "Prefer not to answer",
      ],
      answer: null,
    },
    {
      questionId: 2,
      question:
        "Approximately how many other devices were using your internet while you ran the test? (Other people in your home that are online, Alexa, smart home devices, security cameras, etc.)",
      answerName: "devices",
      answerType: "radio",
      answerOptions: ["1 - 5", "5 - 9", "10 or more", "Prefer not to answer"],
      answer: null,
    },
    {
      questionId: 3,
      question:
        "How satisfied are you with the speed of your internet service?",
      answerName: "service-speed",
      answerType: "radio",
      answerOptions: [
        "Very dissatisfied",
        "Somewhat dissatisfied",
        "Neutral",
        "Somewhat satisfied",
        "Very satisfied",
        "Prefer not to answer",
      ],
      answer: null,
    },
    {
      questionId: 4,
      question:
        "How do you use your internet connection? (check all that apply)",
      answerName: "uses",
      answerType: "checkbox",
      answerOptions: [
        "K-12 Education",
        "Higher Education",
        "Personal/General",
        "Remote Work/Home Business",
        "Telemedicine",
        "Prefer not to answer",
      ],
      answer: [],
    },
    {
      questionId: 5,
      question:
        "If high speed fiber internet were available at your location, how much per month would you be willing to pay? (High speed fiber internet would typically allow one person to be uploading and downloading multiple videos, music files and photos, a second person to watch a video (Hulu, Netflix, Amazon Prime), and a third person to be browsing and reading email, all at the same time.)",
      answerName: "cost",
      answerType: "radio",
      answerOptions: [
        "less than $25",
        "$25-$50",
        "$50-$75",
        "$75-$100",
        "more than $100",
        "Prefer not to answer",
      ],
      answer: null,
    },
    {
      questionId: 6,
      question:
        "How reliable is your current internet service? (Select all that apply)",
      answerName: "reliability",
      answerType: "checkbox",
      answerOptions: [
        "good connection at all times of day",
        "slow connection at least once a day",
        "connection speed is always slow",
        "connection is rarely dropped",
        "connection drops occasionally",
        "connection often drops",
      ],
      answer: [],
    },
    {
      questionId: 7,
      question: "Additional questions or feedback?",
      answerName: "feedback",
      answerType: "textarea",
      answerOptions: [],
      answer: [],
    },
  ];

  // Save the survey locally and on the database. Display all survey results.
  function finishSurvey() {
    console.log(`Finish Survey`);

    if (questionNumber === 3 || questionNumber === 5) {
      surveyInfo[questionNumber].answer = usesCheckboxAnswers;
    }

    //@TODO: Need to handle "other" scenario for checkbox question. Currently stored in surveyInfo[x].other as a string
    const location = $currentTest.city ? $currentTest.city.split(",") : [];
    let data = {
      userID: $page.data.userid,
      speedTestID: $currentTest._id,
      date: new Date().toString(),
      city: location[0],
      state: location[1],
      answers: surveyInfo.map((question) => {
        if (
          question.answerName === "uses" ||
          question.answerName === "reliability"
        ) {
          //this is for the multi answer (checkbox)
          return {
            questionId: question.answerName,
            answer: question.answer.join(", "),
          };
        } else {
          return {
            questionId: question.answerName,
            answer: question.answer.toString(),
          };
        }
      }),
    };

    postSurveyResults(data);

    //this is returned to the parent component
    submitted = true;
  }

  // HTTP request to post the results to the database.
  async function postSurveyResults(results) {
    console.log(`Post Survey Results:`);

    const res = await fetch("/api/v1/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results),
    });
    console.log(res);
    if (res.ok) {
      const success = await res.json();
      let testId = success.entryId;
    } else {
      console.error(res);
      const error = await res.json();
      console.error(error);
    }
  }

  // Toggle to previous question and store data locally.
  async function prevQuestion() {
    questionNumber--;

    if (questionNumber < 0) {
      console.log("Question number less than or equal to 0.");
      questionNumber = 0;
    }
  }

  // Toggle to next question and store data locally.
  async function nextQuestion() {
    if (questionNumber === 3 || questionNumber === 5) {
      surveyInfo[questionNumber].answer = usesCheckboxAnswers;
    }

    const answer = surveyInfo[questionNumber].answer;

    if (answer === null || answer.length === 0) {
      message = "Please select an answer.";
      return;
    } else {
      message = null;
    }

    questionNumber++;

    if (questionNumber === surveyInfo.length - 1) {
      allQuestionsAnswered = true;
    }
    if (questionNumber > surveyInfo.length - 1) {
      console.log("Question number greater than the question array length.");
      questionNumber = surveyInfo.length - 1;
    }
  }
</script>

<div
  class="bg-base-100 bg-opacity-80 
            p-4 w-full h-100
            rounded-xl prose "
>
  {#if submitted === true}
    <div class="w-full text-center py-10">
      <div>Thank you for your submission!</div>
      <a class="text-blue-600" href="results">Go to Results Page</a>
    </div>
  {:else}
    <p class="w-full text-left">{questionNumber + 1} of {surveyInfo.length}</p>

    <div class="">
      <h3 class="">{surveyInfo[questionNumber].question}</h3>
      <div class="flex justify-center">
        {#if questionNumber === 0}
          <div>
            {#each surveyInfo[questionNumber].answerOptions as option}
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    class="radio radio-secondary"
                    type="radio"
                    id={option}
                    bind:group={surveyInfo[questionNumber].answer}
                    value={option}
                  />
                  <span class="label-text ml-5">{option}</span>
                </label>
              </div>
            {/each}
          </div>
        {:else if questionNumber === 1}
          <div>
            {#each surveyInfo[questionNumber].answerOptions as option}
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    class="radio radio-secondary"
                    type="radio"
                    id={option}
                    bind:group={surveyInfo[questionNumber].answer}
                    value={option}
                  />
                  <span class="label-text ml-5">{option}</span>
                </label>
              </div>
            {/each}
          </div>
        {:else if questionNumber === 2}
          <div>
            {#each surveyInfo[questionNumber].answerOptions as option}
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    class="radio radio-secondary"
                    type="radio"
                    id={option}
                    bind:group={surveyInfo[questionNumber].answer}
                    value={option}
                  />
                  <span class="label-text ml-5">{option}</span>
                </label>
              </div>
            {/each}
          </div>
        {:else if questionNumber === 3}
          <div>
            {#each surveyInfo[questionNumber].answerOptions as option}
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    class="checkbox checkbox-secondary"
                    type="checkbox"
                    id={option}
                    bind:group={usesCheckboxAnswers}
                    value={option}
                  />
                  <span class="label-text ml-5">{option}</span>
                </label>
              </div>
            {/each}
          </div>
        {:else if questionNumber === 4}
          <div>
            {#each surveyInfo[questionNumber].answerOptions as option}
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    class="radio radio-secondary"
                    type="radio"
                    id={option}
                    bind:group={surveyInfo[questionNumber].answer}
                    value={option}
                  />
                  <span class="label-text ml-5">{option}</span>
                </label>
              </div>
            {/each}
          </div>
        {:else if questionNumber === 5}
          <div>
            {#each surveyInfo[questionNumber].answerOptions as option}
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    class="checkbox checkbox-secondary"
                    type="checkbox"
                    id={option}
                    bind:group={usesCheckboxAnswers}
                    value={option}
                  />
                  <span class="label-text ml-5">{option}</span>
                </label>
              </div>
            {/each}
          </div>{:else if questionNumber === 6}
          <textarea
            class="textarea w-full"
            bind:value={surveyInfo[questionNumber].answer}
            rows="4"
          />
        {:else}
          <div>
            Error: Input for this survey question has not been accounted for.
            (index:{questionNumber} of surveyInfo. Component: Survey.svelte)
          </div>
        {/if}
      </div>
    </div>

    {#if message}
      <div class="text-red-500 w-full flex justify-center">{message}</div>
    {/if}
    <div class="my-5 w-full flex justify-center">
      {#if questionNumber !== 0}
        <button
          class="btn btn-secondary min-w-[50px] mx-2 text-3xl"
          on:click={prevQuestion}>←</button
        >
      {/if}
      {#if questionNumber !== surveyInfo.length - 1}
        <button
          class="btn btn-secondary min-w-[50px] mx-2 text-3xl"
          on:click={nextQuestion}>→</button
        >
      {/if}
    </div>

    {#if allQuestionsAnswered}
      <div class="w-full flex justify-center">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={finishSurvey}>Submit</button
        >
      </div>
    {/if}
  {/if}
</div>
