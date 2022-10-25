/**
 * jspsych-canvas-keyboard-response
 * Chris Jungerius (modified from Josh de Leeuw)
 *
 * a jsPsych plugin for displaying a canvas stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["memory-gabor-display"] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'memory-gabor-display',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The drawing function to apply to the canvas. Should take the canvas object as argument.'
      },
      probe_type: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Spatial Frequency',
          default: 1,
          description: 'The spatial frequency applied to the gabor'
      },
      orientation: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Orientation',
          default: 0,
          description: 'The orientation of the gabor (in degrees from vertical)'
      },
      bg_col: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Background colour',
          array: true,
          default: [128, 128, 128],
          description: 'Array of RGB values for the background colour'
      },
      colour1: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Colour 1',
          array: true,
          default: [255, 255, 255],
          description: 'Array of RGB values for one colour in the gabor'
      },
      colour2: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Colour 2',
          array: true,
          default: [0, 0, 0],
          description: 'Array of RGB values for second colour in the gabor'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
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
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'If true, trial will end when subject makes a response.'
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas size',
        default: [500, 500],
        description: 'Array containing the height (first value) and width (second value) of the canvas element.'
      },
      gb_size: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Gabor size',
          default: 50,
          description: 'The diameter of the Gabor stimulus'
      },
      gb_std: {
          type: jsPsych.plugins.parameterType.iNT,
          pretty_name: 'Gabor standard deviation',
          default: 40,
          description: 'The standard deviation of the Gaussian envelope around the Gabor stimulus'
      }
    }
  }

  plugin.trial = function (display_element, trial) {

    var new_html = '<div id="jspsych-canvas-keyboard-response-stimulus">' + '<canvas id="jspsych-canvas-stimulus" height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] + '"></canvas>' +  '</div><div id="jspsych-fixation-stimulus-container"><canvas id="jspsych-fixation-stimulus" height="50" width = "50"></canvas></div>';
    // add prompt
    if (trial.prompt !== null) {
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;
    let c = document.getElementById("jspsych-canvas-stimulus")
    let d = document.getElementById("jspsych-fixation-stimulus")
    trial.stimulus(c, trial.gb_size,  trial.colour1, trial.probe_type)
    // trial.stimulus(c, trial.orientation, trial.gb_size, trial.gb_std, 0, trial.spatial_freq, trial.colour1, trial.colour2, trial.bg_col)
    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function () {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function (info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-canvas-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        display_element.querySelector('#jspsych-canvas-keyboard-response-stimulus').style.visibility = 'hidden';
        fixationgen(d, [255, 255, 255], 2)
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
