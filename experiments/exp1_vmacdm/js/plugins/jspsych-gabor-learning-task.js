/**
* jsPsych plugin for showing RSVP sequence
* Mike Le Pelley
*
* documentation: docs.jspsych.org
*/

jsPsych.plugins["gabor-learning-task"] = (function() {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('rsvp-sequence-keyboard-response', 'stimuli', 'image');

    plugin.info = {
        name: 'rsvp-sequence-keyboard-response',
        description: '',
        parameters: {
            memCueDuration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'memCueDuration',
                default: 50,
                description: 'memCueDuration.'
            },
            maskDuration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'maskDuration',
                default: 100,
                description: 'maskDuration.'
            },
            delayDuration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'delayDuration',
                default: 2000,
                description: 'delayDuration.'
            },
            memCueTilt: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'memCueTilt',
                default: 120,
                description: 'memCueTilt.'
            },
            memCueContrast: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'memCueContrast',
                default: 0.10,
                description: 'Michelson contrast of memory cue'
            },
            testCueType: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'testCuetype',
                default: 1,
                description: '1 = Clockwise, 2 = Anticlockwise'
            },
            memCueSF: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'memCueType',
                default: 0.08,
                description: 'Spatial frequency of the memory cue (0.02 or 0.08)'
            },
            memCueSize: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'memCueSize',
                default: 250,
                description: 'memCueSize'
            },
            memCueStd: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'memCueStd',
                default: 50,
                description: 'memCueStd'
            },
            maskSize: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'maskSize',
                default: 350,
                description: 'maskSize'
            },
            testCueSF: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'testCueType',
                default: 0.05,
                description: 'Spatial frequency of the test cue (normally 0.05)'
            },
            feedbackDuration: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'feedbackDuration',
                default: 600,
                description: 'feedbackDuration'
            },
            timeoutDuration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'timeoutDuration',
                default: 10000,
                description: 'timeoutDuration'
            }
        }
    }

    plugin.trial = function(display_element, trial) {

        display_element.innerHTML = '<canvas id="myCanvas" width="350px" height="350px">Your browser does not support the HTML5 canvas tag.</canvas>'

        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        var animate_frame = -1;

        var advance_stream = 1;


        var col1 = [];
        var col2 = [];
        col1 = michelson_bw(trial.memCueContrast,1);
        col2 = michelson_bw(trial.memCueContrast,2);
        var bg_col = [128,128,128];

        var maskcol1 = [];
        var maskcol2 = [];
        maskcol1 = michelson_bw(.8,1);
        maskcol2 = michelson_bw(.8,2);

        var gb_size = trial.memCueSize;
        var gb_std = trial.memCueStd;
        var gb_sf = trial.memCueSF;
        var mask_size = trial.maskSize;
        var test_sf = trial.testCueSF;

        var mem_tilt_offset = [];
        if (trial.testCueType == 1) {
            mem_tilt_offset = 30;
        } else {
            mem_tilt_offset = -30;
        }

        var stimuli = [];
        // this is the memory cue
        stimuli[0] = gaborgen(trial.memCueTilt, gb_size, gb_std, 0, gb_sf, col1, col2, bg_col);
        stimuli[1] = maskgen(mask_size, gb_std, 0, .05, maskcol1, maskcol2, bg_col);
        stimuli[2] = maskgen(mask_size, gb_std, 0, .05, bg_col, bg_col, bg_col);
        stimuli[3] = gaborgen(trial.memCueTilt + mem_tilt_offset, gb_size, gb_std, 0, test_sf, col1, col2, bg_col);

        var numFrames = stimuli.length;   // Last two items hold distractor and target

        // trial.stimuli[trial.distractorPosition] = trial.stimuli[trial.stimuli.length - 2];  // Penultimate location holds the distractor for this trial
        // trial.stimuli[trial.targetPosition] = trial.stimuli[trial.stimuli.length - 1];  // Last location holds the target for this trial

        // trial.stimuli.length = numFrames;

        var stimDur = [];

        stimDur[0] = 0;  // Present first stimulus immediately
        stimDur[1] = trial.memCueDuration;
        stimDur[2] = trial.maskDuration;
        stimDur[3] = trial.delayDuration;
        // stimDur[4] = trial.timeoutDuration;
        // stimDur[5] = trial.feedbackDuration;

       

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
            } else {
                setTimeout(function(){
                    endTrial()
                    // requestAnimationFrame(endTrial)
                }, stimDur[animate_frame]);
            };
        };

        requestAnimationFrame(stimLoopFn);


        function show_next_frame() {
            // show image

            ctx.putImageData(stimuli[animate_frame], c.width / 2 - stimuli[animate_frame].width / 2,c.height / 2 - stimuli[animate_frame].height / 2)

            
            // display_element.innerHTML = '<img src="'+trial.stimuli[animate_frame]+'" id="jspsych-rsvp-sequence-image"></img>';

            current_stim = stimuli[animate_frame];

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

        // function clear_display() {
        //     display_element.innerHTML = "<p style='color:#00FF00;font-size:180%;line-height:150%;'>COLOURED PICTURE HERE</p>";
        //     advance_stream = 1;

        //     // setTimeout(function(){
        //     //     show_next_frame();
        //     //     requestAnimationFrame(stimLoopFn);
        //     // }, trial.feedbackDuration);
            
        // }

        // var valid_keys = [trial.distractor_key];

        // key_listener = jsPsych.pluginAPI.getKeyboardResponse({
        //     callback_function: after_response,
        //     valid_responses: valid_keys,
        //     rt_method: 'performance',
        //     persist: false,
        //     allow_held_key: false
        // }); 



        function endTrial(rt) {

            // jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

            var rsvp_time = (new Date()).getTime() - startTime;

            var trial_data = {
                // "animation_sequence": JSON.stringify(animation_sequence),
                "rsvp_time": rsvp_time,
                // "rt": rt,
                "animate_frame": animate_frame
            };

            jsPsych.finishTrial(trial_data);
        }
    };

    return plugin;
})();
