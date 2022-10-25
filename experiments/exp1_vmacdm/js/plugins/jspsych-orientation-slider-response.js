/**
 * jspsych-canvas-slider-response
 * Chris Jungerius (modified from Josh de Leeuw)
 *
 * a jsPsych plugin for displaying a canvas stimulus and getting a slider response
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['orientation-slider-response'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'orientation-slider-response',
        description: '',
        parameters: {
            stimulus: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The drawing function to apply to the canvas. Should take the canvas object as argument.'
            },
            min: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Min slider',
                default: -90,
                description: 'Sets the minimum value of the slider.'
            },
            max: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Max slider',
                default: 90,
                description: 'Sets the maximum value of the slider',
            },
            slider_start: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Slider starting value',
                default: randomIntFromInterval(-90, 90),
                description: 'Sets the starting value of the slider',
            },
            step: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Step',
                default: 1,
                description: 'Sets the step of the slider'
            },
            labels: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name: 'Labels',
                default: [],
                array: true,
                description: 'Labels of the slider.',
            },
            slider_width: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Slider width',
                default: null,
                description: 'Width of the slider in pixels.'
            },
            button_label: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Button label',
                default: 'Submit',
                array: false,
                description: 'Label of the button to advance.'
            },
            require_movement: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Require movement',
                default: true,
                description: 'If true, the participant will have to move the slider before continuing.'
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed below the slider.'
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus duration',
                default: null,
                description: 'How long to hide the stimulus.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show the trial.'
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, trial will end when user makes a response.'
            },
            canvas_size: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'Canvas size',
                default: [250, 250],
                description: 'Array containing the height (first value) and width (second value) of the canvas element.'
            },
            correct_angle: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Correct angle',
                default: 0,
                description: 'The actual angle of the probed gabor'
            },
            feedback_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Feedback duration',
                default: 200,
                description: 'The duration of the feedback display'
            },
            dial_radius: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Dial radius',
                default: 90,
                description: 'The radius of the response dial'
            },
            fixation_color: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Fixation color',
                array: true,
                default: [0,0,0],
                description: 'The color of the fixation stimulus'
            },
            fixation_type: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Fixation type',
                default: undefined,
                description: 'The type of fixation (1 = circle, 2 = square)'
            },
            reward_level: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Reward level',
                default: 2,
                description: 'The trial type for this trial (1 = high reward, 2 = low reward)'
            },
            running_total: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Running total',
                default: undefined,
                description: 'The running total of point accumulated so far'
            },
            expt_phase: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Experiment phase',
                default: 1,
                description: 'The current phase of the experiment (0 = practice, 1 = main trials, 2 = unrewarded)'
            }

        }
    }

    plugin.trial = function (display_element, trial) {

        var html = '<div id="jspsych-canvas-slider-response-wrapper" style="margin: 10px 0px;">';
        html += '<div id="jspsych-canvas-slider-response-stimulus">' + '<canvas id="jspsych-canvas-stimulus" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' + '</div>';
        html += '<div class="jspsych-canvas-slider-response-container" style="position:relative; padding-top: ' + (trial.canvas_size[0] + 80) + 'px; margin: 0 auto 2em auto; width:';
        if (trial.slider_width !== null) {
            html += trial.slider_width + 'px;';
        } else {
            html += trial.canvas_size[1] + 'px;';
        }
        html += '">';
        html += '<input type="range" value="' + trial.slider_start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" style="width: 100%;" id="jspsych-canvas-slider-response-response"></input>';
        html += '<div>'
        for (var j = 0; j < trial.labels.length; j++) {
            var width = 100 / (trial.labels.length - 1);
            var left_offset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
            html += '<div style="display: inline-block; position: absolute; left:' + left_offset + '%; text-align: center; width: ' + width + '%;">';
            html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + '</span>';
            html += '</div>'
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';

        if (trial.prompt !== null) {
            html += trial.prompt;
        }

        // add submit button
        html += '<button id="jspsych-canvas-slider-response-next" class="jspsych-btn" ' + (trial.require_movement ? "disabled" : "") + '>' + trial.button_label + '</button>';

        display_element.innerHTML = html;




        // draw
        let c = document.getElementById("jspsych-canvas-stimulus")
        var origin = [trial.canvas_size[0]/2,trial.canvas_size[1]/2];
        trial.stimulus(c, 50, trial.fixation_color, 4, trial.fixation_type, origin, trial.dial_radius, 2, [177,177,177], trial.slider_start, 8, [0,0,0], [177,177,177], 2);

        var s = document.getElementById("jspsych-canvas-slider-response-response");
        s.addEventListener("input", function() {
            var slider_val = event.target.value;
            trial.stimulus(c, 50, trial.fixation_color, 4, trial.fixation_type, origin, trial.dial_radius, 2, [177,177,177], slider_val, 8, [0,0,0], [177,177,177], 2);    
        })

        

        var response = {
            rt: null,
            response: null,
            timeout: false
        };

        if (trial.require_movement) {
            display_element.querySelector('#jspsych-canvas-slider-response-response').addEventListener('mousedown', function () {
                display_element.querySelector('#jspsych-canvas-slider-response-next').disabled = false;

                // end trial if trial_duration is set
                if (trial.trial_duration !== null) {
                    jsPsych.pluginAPI.setTimeout(function () {
                        end_trial();
                    }, trial.trial_duration);
                }
            })
        } else {
            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                jsPsych.pluginAPI.setTimeout(function () {
                    end_trial();
                }, trial.trial_duration);
            }
        }

        display_element.querySelector('#jspsych-canvas-slider-response-next').addEventListener('click', function () {
            // measure response time
            var endTime = performance.now();
            response.rt = endTime - startTime;
            response.response = display_element.querySelector('#jspsych-canvas-slider-response-response').valueAsNumber;

            if (trial.response_ends_trial) {
                end_trial();
            } else {
                display_element.querySelector('#jspsych-canvas-slider-response-next').disabled = true;
            }

        });

        function end_trial() {

            jsPsych.pluginAPI.clearAllTimeouts();

            // record response if a timeout
            if (response.response == null) {
                response.response = display_element.querySelector('#jspsych-canvas-slider-response-response').valueAsNumber; // if a timeout, use most recent slider position
                response.rt = 9999; // mark as timeout by having rt > trial duration
                response.timeout = true
            } else {
                response.timeout = false
            }

            var deg_error = Math.min(Math.abs(trial.correct_angle - response.response), 180-Math.abs(trial.correct_angle - response.response));
            var feedback_display;

            if (trial.expt_phase < 2){
                feedback_display = Math.round(normalize(deg_error, 90, 0) * 100);
            }

            var feedback_html = '<div id="wrapper">';

            if (trial.reward_level == 1 & trial.expt_phase < 2){
                feedback_display = feedback_display * 10;
                feedback_html += '<div id="bonus-box" style="margin: 0 auto; background-color:yellow;"><span style="padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; display: inline-block; color:black; font-family: courier; font-size: 250%; font-weight: bold">10x Bonus!</span></div>'
            }

            if (trial.expt_phase < 2){
                feedback_html += '<div id="feedback-box" style="clear: both; margin: 30px auto;"><span style="color:yellow; font-family:courier; font-size: 250%; font-weight: bold;">' + '+' + feedback_display + '</span></div>';
            } else {
                feedback_html += '<div id="feedback-box" style="clear: both; margin: 30px auto;"><span style="color:yellow; font-family:courier; font-size: 250%; font-weight: bold;">XXX</span></div>';
            }
            if (trial.expt_phase == 1){
                feedback_html += '<div id="total-points-box" style="clear: both; margin: 50px auto;"><span style="color:white; font-family:courier; font-size: 150%;">' + (trial.running_total + feedback_display) + ' total</span></div>';
            }
            feedback_html += '</div>';

            display_element.innerHTML = feedback_html;

            // save data
            var trialdata = {
                "rt": response.rt,
                "response": response.response,
                "timeout": response.timeout,
                "correct_angle": trial.correct_angle,
                "deg_error": deg_error,
                "slider_start": trial.slider_start,
                "trial_points": feedback_display,
                "total_points":  trial.running_total + feedback_display,
                "reward_type": trial.reward_level,
            };


            // next trial
            jsPsych.pluginAPI.setTimeout(function () {
                jsPsych.finishTrial(trialdata);
            }, trial.feedback_duration);
           
        }

        if (trial.stimulus_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function () {
                display_element.querySelector('#jspsych-canvas-slider-response-stimulus').style.visibility = 'hidden';
            }, trial.stimulus_duration);
        }

        

        var startTime = performance.now();
    };

    return plugin;
})();
