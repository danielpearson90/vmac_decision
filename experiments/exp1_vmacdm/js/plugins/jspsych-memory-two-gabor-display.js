/**
 * jspsych-canvas-keyboard-response
 * Chris Jungerius (modified from Josh de Leeuw)
 *
 * a jsPsych plugin for displaying a canvas stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["memory-two-gabor-display"] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'memory-two-gabor-display',
    description: '',
    parameters: {
      stimulus_left: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Stimulus (Left)',
        default: undefined,
        description: 'The drawing function to apply to the left side of the canvas. Should take the canvas object as argument.'
      },
      stimulus_right: {
          type: jsPsych.plugins.parameterType.FUNCTION,
          pretty_name: 'Stimulus (Right)',
          default: undefined,
          description: 'The drawing function to apply to the right side of the canvas. Should take the canvas object as argument.'
      },
      fixation: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Fixation cross generator',
        default: undefined,
        description: 'The drawing function to apply to the fixation cross canvas. Should take the canvas object as argument.'
      },
      spatial_freq: {
          type: jsPsych.plugins.parameterType.INT,
          array: true,
          pretty_name: 'Spatial Frequency',
          default: [.05, .05],
          description: 'Array of spatial frequency values to be applied to the gabors [left, right]'
      },
      orientation: {
          type: jsPsych.plugins.parameterType.INT,
          array: true,
          pretty_name: 'Orientation',
          default: [0, 0],
          description: 'Array of orientation values to be applied to the gabors (in degrees from vertical) [left, right]'
      },
      bg_col: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Background colour',
          array: true,
          default: [[128, 128, 128],[128, 128, 128]],
          description: 'Array of RGB arrays for the background colour(s)'
      },
      colour1: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Colour 1',
          array: true,
          default: [[255, 255, 255],[255, 255, 255]],
          description: 'Array of RGB arrays for one colour in the gabor'
      },
      colour2: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Colour 2',
          array: true,
          default: [[0, 0, 0],[0, 0, 0]],
          description: 'Array of RGB arrays for second colour in the gabor'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.NO_KEYS,
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
      container_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Container size',
        default: [500, 700],
        description: 'Array containing the height (first value) and width (second value) of the container element.'
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas size',
        default: [[250, 250], [250, 250]]
      },
      fixation_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Fixation size',
        default: [50, 50]
      },
      gb_size: {
          type: jsPsych.plugins.parameterType.INT,
          array: true,
          pretty_name: 'Gabor size',
          default: [180, 180],
          description: 'Array of diameters of the Gabor stimuli'
      },
      gb_std: {
          type: jsPsych.plugins.parameterType.INT,
          array: true,
          pretty_name: 'Gabor standard deviation',
          default: [40, 40],
          description: 'Array of standard deviations of the Gaussian envelope around the Gabor stimuli'
      }
    }
  }

  plugin.trial = function (display_element, trial) {

    // have to figure this out? Maybe can use flexbox?

    var new_html = '<div id="canvasContainer" style="width:' + trial.container_size[1] + 'px; height:' + trial.container_size[0] + 'px">' +
    '<canvas id= "jspsych-canvas-stimulus-left" width="' + trial.canvas_size[0][1] + 'px" height="' + trial.canvas_size[0][0] + 'px" style="width:' + trial.canvas_size[0][1] + 'px; height:' + trial.canvas_size[0][0] + 'px;"></canvas>' +
    '<div id="jspsych-fixation-stimulus-container"><canvas id= "jspsych-canvas-fixation" width="' + trial.fixation_size[1] + 'px" height="' + trial.fixation_size[0] + 'px" style="width:' + trial.fixation_size[1] + 'px; height:' + trial.fixation_size[0] + 'px;"></canvas></div>' +
    '<canvas id= "jspsych-canvas-stimulus-right" width="' + trial.canvas_size[1][1] + 'px" height="' + trial.canvas_size[1][0] + 'px" style="width:' + trial.canvas_size[1][1] + 'px; height:' + trial.canvas_size[1][0] + 'px;"></canvas>' +
    '</div>'
    
    // add prompt
    if (trial.prompt !== null) {
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;
    let c = document.getElementById("jspsych-canvas-stimulus-left")
    let d = document.getElementById("jspsych-canvas-stimulus-right")
    let e = document.getElementById("jspsych-canvas-fixation")
    trial.stimulus_left(c, trial.orientation[0], trial.gb_size[0], trial.colour1[0], 30);
    // trial.stimulus_left(c, trial.orientation[0], trial.gb_size[0], trial.gb_std[0], 0, trial.spatial_freq[0], trial.colour1[0], trial.colour2[0], trial.bg_col[0])
    trial.fixation(e, [255, 255, 255], 2)
    trial.stimulus_right(d, trial.orientation[1], trial.gb_size[1], trial.colour1[1], 30);

    // trial.stimulus_right(d, trial.orientation[1], trial.gb_size[1], trial.gb_std[1], 0, trial.spatial_freq[1], trial.colour1[1], trial.colour2[1], trial.bg_col[1])
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
        display_element.querySelector('#jspsych-canvas-stimulus-left').style.visibility = 'hidden';
        display_element.querySelector('#jspsych-canvas-stimulus-right').style.visibility = 'hidden';
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
