PsychDefaultSetup(2);
Screen('Preference', 'SkipSyncTests', 1);
PsychImaging('PrepareConfiguration');
MainWindow = PsychImaging('OpenWindow', 0,[0 0 0 0], [0 0 120 120]);

% Enable alpha-blending
Screen('BlendFunction', MainWindow, 'GL_SRC_ALPHA', 'GL_ONE_MINUS_SRC_ALPHA');

id(1) = CreateProceduralColorGrating(MainWindow, 100, 100, [[193 95 30]/255 1], [0 0 0 1], 50);
id(2) = CreateProceduralColorGrating(MainWindow, 100, 100, [[37, 141, 165]/255 1], [0 0 0 1], 50);
id(3) = CreateProceduralColorGrating(MainWindow, 100, 100, [[70 70 70]/255 1], [0 0 0 1], 50);
id(4) = CreateProceduralColorGrating(MainWindow, 100, 100, [1 1 0 1], [0 0 0 1], 50);

id(5) = CreateProceduralColorGrating(MainWindow, 100, 100, [[193 95 30]/255 1], [0 0 0 1], 51);
id(6) = CreateProceduralColorGrating(MainWindow, 100, 100, [[37, 141, 165]/255 1], [0 0 0 1], 51);
id(7) = CreateProceduralColorGrating(MainWindow, 100, 100, [[70 70 70]/255 1], [0 0 0 1], 51);
id(8) = CreateProceduralColorGrating(MainWindow, 100, 100, [1 1 0 1], [0 0 0 1], 51);

% These settings are the parameters passed in directly to DrawTexture
% baseColor
baseColor(1,:) = [[193 95 30]/255 1];
baseColor(2,:) = [[37, 141, 165]/255 1];
baseColor(3,:) = [.27 .27 .27 1];
baseColor(4,:) = [1 1 0 1];

% % FOR RINGS
% Screen('FrameOval', MainWindow, [.27, .27, .27 1], [], 8, 8)
% Screen('Flip', MainWindow)
% im_mat = Screen('GetImage', MainWindow, [], [], [], 4);
% imwrite(im_mat(:,:,1:3), 'std_ring.png','png', 'Alpha', im_mat(:,:,4));

% Screen('FrameOval', MainWindow, [.5, .5, .5, 1], [], 8, 8)
% Screen('Flip', MainWindow)
% im_mat = Screen('GetImage', MainWindow, [], [], [], 4);
% imwrite(im_mat(:,:,1:3), 'tar_ring.png', 'png', 'Alpha', im_mat(:,:,4));

% Screen('FillPoly', MainWindow, [.27, .27, .27, 1], [0 60; 60 0; 120 60; 60 120], 8)
% Screen('FillPoly', MainWindow, [.0, .0, .0, 1], [8 60; 60 8; 112 60; 60 112], 8)

% Screen('FrameRect', MainWindow, [.27,.27,.27,1], [], 8);
% Screen('Flip', MainWindow);
% im_mat = Screen('GetImage', MainWindow, [], [],[],4);
% imwrite(im_mat(:,:,1:3), 'tar_square.png','png', 'Alpha', im_mat(:,:,4));

% FOR GABORS

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
sigma = .5;
% sigma = -1.0;

step = 0;
for aa = 1:8
    for cc = 1:4
        for ss = 1:8
            step = step + 1;
            Screen('DrawTexture', MainWindow, id(cc), [], [],...
                angle(aa), [], [], baseColor(cc,:), [], [],...
                [phase, frequency(ss), contrast, sigma]);
    
            Screen('Flip', MainWindow);
    
            im_mat = Screen('GetImage', MainWindow, [], [], [], 4);
            
            im_fn = ['decide_c' num2str(cc) '_a' num2str(aa) '_sf' num2str(ss) '.png'];
    
            imwrite(im_mat(:,:,1:3), im_fn, 'png', 'Alpha', im_mat(:,:,4));
        end
    end
end
% 
% %  FOR SEARCH GABORS
% % angle
% angle = [0, 90];
% % phase
% phase = 0;
% % spatial frequency
% f_log = -1.3;
% frequency = 10.^f_log;
% % contrast
% contrast = 0.5;
% % sigma < 0 is a sinusoid.
% % sigma = -1.0;
% 
% for aa = 1:2
%     for cc = 1:4
%         for ss = 1:1
%             Screen('DrawTexture', MainWindow, id(cc), [], [],...
%                 angle(aa), [], [], baseColor(cc,:), [], [],...
%                 [phase, frequency(ss), contrast, sigma]);
%     
%             Screen('Flip', MainWindow);
%     
%             im_mat = Screen('GetImage', MainWindow, [], [], [], 4);
%             
%             im_fn = ['search_c' num2str(cc) '_a' num2str(aa) '.png'];
%     
%             imwrite(im_mat(:,:,1:3), im_fn, 'png', 'Alpha', im_mat(:,:,4));
%         end
%     end
% end

% %  FOR DIAMOND GABORS
% % angle
% angle = [0, 90];
% % phase
% phase = 0;
% % spatial frequency
% f_log = -1.3;
% frequency = 10.^f_log;
% % contrast
% contrast = 0.5;
% % sigma < 0 is a sinusoid.
% sigma = .5;
% 
% % create a diamond shaped mask
% N = 101;
% Nh = (N)/2;
% range_vec = [1:Nh Nh-1:-1:1];
% out = bsxfun(@plus,range_vec(:),range_vec) > Nh;
% out(:,1) = [];
% out(1,:) = [];
% out2 = padarray(out, [11 11], 0, 'both')
% out3 = abs(1-out2);
% 
% full_out(:,:,1:3) = zeros(120,120,3);
% full_out(:,:,4) = out3
% 
% 
% 
%    
% 
% for aa = 1:2
%     for cc = 1:4
%         for ss = 1:1            
%             Screen('DrawTexture', MainWindow, id(cc), [], [],...
%                 angle(aa), [], [], baseColor(cc,:), [], [],...
%                 [phase, frequency(ss), contrast, sigma]);
%             alpha_chan = Screen('MakeTexture', MainWindow, full_out);
% 
%             Screen('DrawTexture', MainWindow, alpha_chan)
%     
% 
% 
%             Screen('Flip', MainWindow);
%             im_mat = Screen('GetImage', MainWindow, [], [], [], 4);            
%             im_fn = ['search_target_c' num2str(cc) '_a' num2str(aa) '.png'];
%     
%             imwrite(im_mat(:,:,1:3), im_fn, 'png', 'Alpha', im_mat(:,:,4));
%         end
%     end
% end


% % FOR DECISION MAKING TASK PLACEHOLDERS
% Screen('FillOval', MainWindow, [0 0 0 0])
% im_mat = Screen('GetImage', MainWindow, [], [], [], 4);
% im_fn = ['decide_placeholder.png'];
% imwrite(im_mat(:,:,1:3), im_fn, "png", 'Alpha', im_mat(:,:,4));

