/**
 * jspsych-canvas-button-response
 * Chris Jungerius (modified from Josh de Leeuw)
 *
 * a jsPsych plugin for displaying a canvas stimulus and getting a button response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["fixation-canvas-display"] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'fixation-canvas-display',
        description: '',
        parameters: {
            stimulus: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The drawing function to apply to the canvas. Should take the canvas object as argument.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show the trial.'
            },
            canvas_size: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'Canvas size',
                default: [50, 50],
                description: 'Array containing the height (first value) and width (second value) of the canvas element.'
            }

        }
    }

    plugin.trial = function (display_element, trial) {

        // create canvas
        var html = '<div id="jspsych-fixation-stimulus-container">' + '<canvas id="jspsych-canvas-stimulus" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';

        display_element.innerHTML = html;

        //draw
        let c = document.getElementById("jspsych-canvas-stimulus")
        trial.stimulus(c, [0,0,0], 2)

        // start time
        var start_time = performance.now();

        // function to end trial when it is time
        function end_trial() {

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // gather the data to store for the trial
            var trial_data = {
                "fixtime": trial.trial_duration,
            };

            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };

        // end trial if time limit is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function () {
                end_trial();
            }, trial.trial_duration);
        }

    };

    return plugin;
})();
