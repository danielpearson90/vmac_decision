PsychDefaultSetup(2);
Screen('Preference', 'SkipSyncTests', 1);
PsychImaging('PrepareConfiguration');
MainWindow = PsychImaging('OpenWindow', 0,[0 0 0], [0 0 100 100]);

% Enable alpha-blending
Screen('BlendFunction', MainWindow, 'GL_SRC_ALPHA', 'GL_ONE_MINUS_SRC_ALPHA');

id(1) = CreateProceduralColorGrating(MainWindow, 100, 100, [[193 95 30]/255 1], [0 0 0 1], 50);
id(2) = CreateProceduralColorGrating(MainWindow, 100, 100, [[37, 141, 165]/255 1], [0 0 0 1], 50);
id(3) = CreateProceduralColorGrating(MainWindow, 100, 100, [[70 70 70]/255 1], [0 0 0 1], 50);
% These settings are the parameters passed in directly to DrawTexture
% baseColor
baseColor(1,:) = [[193 95 30]/255 1];
baseColor(2,:) = [[37, 141, 165]/255 1];
baseColor(3,:) = [.27 .27 .27 1];

% angle
angle = [10, 20, 30, 40, 50, 60, 70, 80];
% phase
phase = 0;
% spatial frequency
f_log = -1.8:.1:-.8;
f_log(6) = [];
frequency = 10.^f_log;
% contrast
contrast = 0.5;
% sigma < 0 is a sinusoid.
sigma = -1.0;

for aa = 1:8
    for cc = 1:3
        for ss = 1:8
            Screen('DrawTexture', MainWindow, id(cc), [], [],...
                angle(aa), [], [], baseColor(cc,:), [], [],...
                [phase, frequency(ss), contrast, sigma]);
    
            Screen('Flip', MainWindow);
    
            im_mat = Screen('GetImage', MainWindow, [], [], [], 3);
            
            im_fn = ['decide_c' num2str(cc) '_a' num2str(aa) '_sf' num2str(ss) '.png'];
    
            imwrite(im_mat, im_fn);
        end
    end
end

