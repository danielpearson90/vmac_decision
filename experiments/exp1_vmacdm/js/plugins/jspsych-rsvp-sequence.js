/**
* jsPsych plugin for showing RSVP sequence
* Mike Le Pelley
*
* documentation: docs.jspsych.org
*/

jsPsych.plugins["rsvp-sequence"] = (function() {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('rsvp-sequence', 'stimuli', 'image');

    plugin.info = {
        name: 'rsvp-sequence',
        description: '',
        parameters: {
            stimuli: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Stimuli',
                default: undefined,
                array: true,
                description: 'The images to be displayed.'
            },
            standardDuration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'standardDuration',
                default: 100,
                description: 'standardDuration.'
            },
            distractorDuration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'distractorDuration',
                default: 100,
                description: 'distractorDuration.'
            },
            distractorPosition: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'distractorPosition',
                default: -1,
                description: 'distractorPosition.'
            },
            targetPosition: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'targetPosition',
                default: -1,
                description: 'targetPosition.'
            },
            lag_type: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'lag_type',
                default: 2,
                description: 'lag_type.'
            }
        }
    }

    plugin.trial = function(display_element, trial) {

        var animate_frame = -1;

        var numFrames = trial.stimuli.length - 2;   // Last two items hold distractor and target

        trial.stimuli[trial.distractorPosition] = trial.stimuli[trial.stimuli.length - 2];  // Penultimate location holds the distractor for this trial
        trial.stimuli[trial.targetPosition] = trial.stimuli[trial.stimuli.length - 1];  // Last location holds the target for this trial

        trial.stimuli.length = numFrames;

        var stimDur = [];

        stimDur[0] = 0;  // Present first stimulus immediately

        for (ii = 1; ii < numFrames+1; ii++) {      // 1 added to things here because this array effectively relates to OFFSETs
            stimDur[ii] = trial.standardDuration;
        };
        stimDur[trial.distractorPosition + 1] = trial.distractorDuration;


        var startTime = (new Date()).getTime();
        // var animation_sequence = [];
        var current_stim = "";


        function stimLoopFn(timestamp){
            animate_frame++;
            if (animate_frame < numFrames) {
                setTimeout(function(){
                    show_next_frame();
                    requestAnimationFrame(stimLoopFn)
                }, stimDur[animate_frame]);
            } else {
                setTimeout(function(){
                    requestAnimationFrame(endTrial)
                }, stimDur[animate_frame]);
            };
        };

        requestAnimationFrame(stimLoopFn);


        // stimLoopFn();
        //
        // function stimLoopFn() {
        //     animate_frame++;
        //
        //     if (animate_frame < numFrames) {
        //         show_next_frame();
        //         setTimeout(function() {
        //             stimLoopFn();
        //         }, stimDur[animate_frame]);
        //     } else {
        //         endTrial();
        //     };
        // };


        function show_next_frame() {
            // show image
            display_element.innerHTML = '<img src="'+trial.stimuli[animate_frame]+'" id="jspsych-rsvp-sequence-image"></img>';

            current_stim = trial.stimuli[animate_frame];

            // record when image was shown
            // animation_sequence.push({
            //     "stimulus": trial.stimuli[animate_frame],
            //     "time": (new Date()).getTime() - startTime
            // });

        }



        function endTrial() {

            // jsPsych.pluginAPI.cancelKeyboardResponse(response_listener);

            var rsvp_time = (new Date()).getTime() - startTime;

            var trial_data = {
                // "animation_sequence": JSON.stringify(animation_sequence),
                "rsvp_time": rsvp_time
            };

            jsPsych.finishTrial(trial_data);
        }
    };

    return plugin;
})();
