/**
* jsPsych plugin for showing RSVP sequence
* Mike Le Pelley
*
* documentation: docs.jspsych.org
*/

jsPsych.plugins["rsvp-sequence-keyboard-response"] = (function() {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('rsvp-sequence-keyboard-response', 'stimuli', 'image');

    plugin.info = {
        name: 'rsvp-sequence-keyboard-response',
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
            },
            distractor_key: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'distractor_key',
                default: 32, // 32 = spacebar
                description: 'The key to press when the participant thinks that the distractor would appear.'
            },
            feedbackDuration: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'feedbackDuration',
                default: 100,
                description: 'feedbackDuration'
            }
        }
    }

    plugin.trial = function(display_element, trial) {

        var animate_frame = -1;

        var advance_stream = 1;

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


        function stimLoopFn(timestamp, info){
            animate_frame++;
            if ((animate_frame < numFrames) & advance_stream == 1) {
                setTimeout(function(){
                    show_next_frame();
                    requestAnimationFrame(stimLoopFn)
                }, stimDur[animate_frame]);
            } else if (animate_frame == numFrames) {
                setTimeout(function(){
                    endTrial(info.rt)
                    // requestAnimationFrame(endTrial)
                }, stimDur[animate_frame]);
            } else {
                clear_display()
            };
        };

        requestAnimationFrame(stimLoopFn);


        function show_next_frame() {
            // show image
            display_element.innerHTML = '<img src="'+trial.stimuli[animate_frame]+'" id="jspsych-rsvp-sequence-image"></img>';

            current_stim = trial.stimuli[animate_frame];

        }

        var trial_over = false;

        var after_response = function(info) {

            // trial_over = true;
            advance_stream = 0;

            clear_display();

            

            // setTimeout(function(){
            //     endTrial(info.rt)
            // }, trial.feedbackDuration);

        }

        function clear_display() {
            display_element.innerHTML = "<p style='color:#00FF00;font-size:180%;line-height:150%;'>COLOURED PICTURE HERE</p>";
            advance_stream = 1;

            // setTimeout(function(){
            //     show_next_frame();
            //     requestAnimationFrame(stimLoopFn);
            // }, trial.feedbackDuration);
            
        }

        var valid_keys = [trial.distractor_key];

        key_listener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: valid_keys,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        }); 



        function endTrial(rt) {

            jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

            var rsvp_time = (new Date()).getTime() - startTime;

            var trial_data = {
                // "animation_sequence": JSON.stringify(animation_sequence),
                "rsvp_time": rsvp_time,
                "rt": rt,
                "animate_frame": animate_frame
            };

            jsPsych.finishTrial(trial_data);
        }
    };

    return plugin;
})();
