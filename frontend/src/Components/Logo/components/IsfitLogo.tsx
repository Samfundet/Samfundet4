import { LogoProps, LogoPalette } from '~/Components/Logo/Logo';
import { COLORS } from '~/types';

type IsfitLogoProps = {
  color: LogoProps['color'];
  size: LogoProps['size'];
};

export function IsfitLogo({ color, size }: IsfitLogoProps) {
  const logoColor = (color: LogoProps['color']): LogoPalette => {
    switch (color) {
      case 'org-color':
        return { primary: COLORS.white, secondary: COLORS.blue_isfit };
      case 'org-alt-color':
        return { primary: COLORS.blue_isfit, secondary: COLORS.white };
      case 'dark':
        return { primary: COLORS.black };
      case 'light':
        return { primary: COLORS.white };
      default:
        return { primary: COLORS.white, secondary: COLORS.blue_isfit };
    }
  };

  const dimensions = {
    xsmall: { logoWidth: '100px', logoHeight: '59.25px' },
    small: { logoWidth: '200px', logoHeight: '118.5px' },
    medium: { logoWidth: '300px', logoHeight: '177.77px' },
    large: { logoWidth: '400px', logoHeight: '237px' },
  };

  return (
    <svg
      style={{ maxWidth: dimensions[size].logoWidth, minHeight: dimensions[size].logoHeight }}
      viewBox="0 0 280.69192 166.4414"
      version="1.1"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs id="defs1" />
      <path
        id="isfit-I-dot-1"
        fill={logoColor(color).primary ?? logoColor(color).secondary}
        fillOpacity="1"
        stroke="none"
        strokeWidth="0.384336"
        strokeOpacity="1"
        d="M 10.706327,7.978845 A 10.090732,10.090732 0 0 0 0.61546996,18.069705 10.090732,10.090732 0 0 0
     10.706327,28.160565 10.090732,10.090732 0 0 0 20.797184,18.069705 10.090732,10.090732 0 0 0 10.706327,7.978845 Z"
      />
      <path
        id="isfit-I-bar-1"
        fill={logoColor(color).primary ?? logoColor(color).secondary}
        fillOpacity="1"
        stroke="none"
        strokeWidth="0.384336"
        strokeOpacity="1"
        d="M 2.673742,41.786085 V 126.79071 H 18.987475 V 41.786085 Z"
      />
      <path
        id="isfit-S"
        fill={logoColor(color).primary ?? logoColor(color).secondary}
        fillOpacity="1"
        stroke="none"
        strokeWidth="0.384336"
        strokeOpacity="1"
        d="m 72.159425,40.227005 c -0.58103,0.001 -1.12469,0.0132 -1.61954,0.0382 -0.98969,0.0501
      -1.78412,0.15467 -2.71094,0.25735 -0.92683,0.10267 -1.98585,0.20341
       -2.77658,0.29611 -0.79072,0.0927 -1.31316,0.17754 -2.10116,0.36845
        -0.78802,0.19092 -1.84147,0.48799 -2.717669,0.76688
         -0.876194,0.27888 -1.5749,0.53974 -2.299601,0.84594
          -0.724701,0.30621 -1.475761,0.65756 -2.245858,1.06195
           -0.770095,0.4044 -1.559169,0.8617 -2.391585,1.39217
            -0.832413,0.53047 -1.708082,1.13395 -2.478402,1.74356
             -0.770318,0.60961 -1.43577,1.22537 -2.216919,2.03192
              -0.781147,0.80654 -1.677943,1.80415 -2.302185,2.59105
               -0.624241,0.7869 -0.975932,1.36297 -1.446423,2.27687 -0.470493,0.91389
                -1.059787,2.16527 -1.465544,3.13004 -0.405755,0.96468 -0.62765,1.64327
                 -0.792199,2.26033 -0.164548,0.61705 -0.271659,1.17256 -0.372587,1.69808
                 -0.100929,0.52552 -0.195958,1.02094 -0.252698,1.62471
                  -0.05673,0.60376 -0.07509,1.31617 -0.07596,2.22415 -8.75e-4,0.90797
                   0.01579,2.0112 0.249081,3.30006 0.233294,1.28887 0.683076,2.76309 1.322917,4.25917
                    0.639841,1.49608 1.469889,3.01422 2.480468,4.377 1.010578,1.36278 2.201769,2.57021
                     2.962093,3.32176 0.760328,0.75155 1.090042,1.04721 1.589567,1.43608 0.499527,0.38888
                      1.168553,0.87117 2.415874,1.63195 1.24732,0.76079 3.072875,1.7998 5.606893,2.97398
                       2.534021,1.17418 5.776747,2.48324 7.903917,3.34449 2.12716,0.86125 3.13868,1.27467
                        4.30929,1.82367 1.17063,0.549 2.50036,1.23363 3.75429,2.02106 1.25393,0.78743 2.43174,1.6776
                         3.26905,2.39675 0.83732,0.71915 1.33426,1.26738 1.67174,1.62884 0.33748,0.36146
                          0.51583,0.53631 0.80718,0.99684 0.29134,0.46053 0.69578,1.20642 0.97669,1.896005
                           0.28092,0.68958 0.43813,1.32243 0.53071,2.1239 0.0926,0.80148 0.12051,1.77209
                            0.0915,2.70371 -0.029,0.93161 -0.11505,1.8246 -0.35915,2.69751 -0.24409,0.8729
                             -0.64629,1.72572 -1.01286,2.39831 -0.36655,0.67258 -0.69766,1.16491 -1.19527,1.75648
                              -0.4976,0.59156 -1.16156,1.28246 -2.01797,1.90428 -0.8564,0.62182 -1.90495,1.17413
                               -2.86752,1.59783 -0.96256,0.42369 -1.83946,0.71869 -2.65204,0.93328 -0.81257,0.21459
                                -1.56093,0.34871 -2.44842,0.47077 -0.88751,0.12207 -1.91399,0.23227 -3.00189,0.29817
                                 -1.08789,0.0659 -2.23702,0.0875 -3.16363,0.0532 -0.9266,-0.0343 -1.63043,-0.1246
                                  -2.294953,-0.22531 -0.664521,-0.1007 -1.289786,-0.21134 -1.767334,-0.29714
                                   -0.477542,-0.0858 -0.807704,-0.14669 -1.751314,-0.35915 -0.943608,-0.21245
        -2.500758,-0.57637 -3.754293,-0.92966 -1.253533,-0.3533 -2.203403,-0.69613
        -2.951241,-0.96738 -0.747838,-0.27126 -1.29387,-0.47095 -1.825211,-0.68472
        -0.531343,-0.21376 -1.047711,-0.44141 -1.716175,-0.74827 -0.668462,-0.30687
        -1.489017,-0.69296 -2.086177,-0.98185 -0.597161,-0.28889 -0.97115,-0.48036
        -1.16272,-0.57826 -0.191579,-0.0978 -0.200689,-0.10224 -0.206189,-0.1018
        -0.0055,4.5e-4 -0.0071,0.004 -0.05271,0.17311 -0.04563,0.16869
        -0.135244,0.50089 -0.310059,1.02785 -0.174815,0.52695 -0.434858,1.24835
         -0.723986,2.0624 -0.28913,0.81404 -0.607183,1.72105 -0.917257,2.62517
         -0.310074,0.9041 -0.612442,1.80556 -0.939994,2.75435 -0.327554,0.94878
         -0.680583,1.94479 -0.856796,2.44326 -0.176264,0.49881 -0.175665,0.49981
         -0.168465,0.50281 0.0072,0.003 0.02098,0.009 0.219108,0.13023
         0.198133,0.12117 0.580748,0.35759 1.3224,0.6966 0.741654,0.339
         1.84245,0.78106 3.062346,1.25625 1.219895,0.4752 2.558955,0.98369
         3.801318,1.39836 1.242363,0.41466 2.387916,0.73503 3.79305,1.048
         1.405134,0.31296 3.069844,0.61853 4.650879,0.84646 1.581035,0.22793
         3.078559,0.37869 4.504635,0.46509 1.426088,0.0864 2.780898,0.10874
         3.763598,0.12144 0.98269,0.0127 1.59343,0.0156 2.33268,-0.0129 0.73924,-0.0285
         1.60702,-0.0886 2.75797,-0.20567 1.15094,-0.11699 2.58474,-0.29136 3.41529,-0.39739
         0.83055,-0.10603 1.05759,-0.14382 2.23552,-0.48008 1.17793,-0.33627 3.30667,-0.97105
         4.62556,-1.38854 1.31888,-0.41749 1.82776,-0.61763 2.50114,-0.92294 0.67337,-0.30532
         1.51118,-0.71576 2.42104,-1.23766 0.90985,-0.52188 1.89181,-1.1553 2.95072,-1.96887
         1.05891,-0.81358 2.19513,-1.807 3.10834,-2.70061 0.91323,-0.89361 1.60352,-1.68729
         2.26756,-2.63808 0.66405,-0.9508 1.30167,-2.05912 1.80971,-3.02617 0.50804,-0.96715
         0.88639,-1.7934 1.17461,-2.54765 0.28822,-0.75426 0.48629,-1.43626 0.6351,-2.06912
         0.14881,-0.63287 0.24871,-1.2163 0.32401,-1.84847 0.0753,-0.63217 0.1262,-1.31287
         0.1664,-2.1332 0.0402,-0.82032 0.0693,-1.78011 0.0703,-2.65359 0.001,-0.87348
         -0.0256,-1.66083 -0.14366,-2.661845 -0.11802,-1.00103 -0.32713,-2.21571 -0.59428,-3.27319 -0.26714,-1.05749
         -0.5926,-1.95771 -1.04593,-2.90421 -0.45334,-0.9466 -1.03459,-1.93993 -1.42627,-2.58899 -0.39168,-0.64906
         -0.59356,-0.95387 -1.03973,-1.4764 -0.44616,-0.52254 -1.13658,-1.26246 -1.89188,-2.00866 -0.75529,-0.74619
         -1.57546,-1.49836 -2.54351,-2.27118 -0.96805,-0.77283 -2.08379,-1.56628 -3.28042,-2.31872 -1.19663,-0.75245
         -2.47395,-1.46393 -3.75119,-2.08928 -1.27724,-0.62535 -2.55442,-1.16466 -4.0318,-1.76113 -1.47739,-0.59646
         -3.15494,-1.25038 -4.50515,-1.78025 -1.3502,-0.52986 -2.37299,-0.93552 -3.51451,-1.42782 -1.14152,-0.4923
         -2.40193,-1.07098 -3.64732,-1.74047 -1.24538,-0.66948 -2.47571,-1.42963 -3.21118,-1.91564 -0.73547,-0.4861
         -0.97619,-0.6984 -1.26762,-0.95912 -0.29144,-0.26071 -0.63365,-0.57004 -0.960668,-0.85472 -0.32701,-0.28469
         -0.638839,-0.54432 -0.946195,-0.88936 -0.307366,-0.34504 -0.610573,-0.77567 -0.887801,-1.25728
         -0.277229,-0.48161 -0.528579,-1.01451 -0.714685,-1.55081 -0.186106,-0.53629 -0.307051,-1.0757
         -0.359151,-1.8986 -0.0521,-0.8229 -0.03537,-1.92926 0.02067,-2.73575 0.05604,-0.80649 0.151516,-1.3129
         0.284221,-1.86551 0.132705,-0.55263 0.302919,-1.15136 0.507462,-1.63918 0.204541,-0.48782 0.443305,-0.86519
         0.716235,-1.25057 0.272934,-0.38538 0.580018,-0.77896 0.930176,-1.16737 0.350159,-0.38842 0.743592,-0.77115
         1.203026,-1.15135 0.45945,-0.38011 0.98501,-0.75767 1.36426,-1.01855 0.37926,-0.26086 0.61241,-0.40557
         0.75809,-0.49867 0.1457,-0.0931 0.20355,-0.13481 0.44132,-0.26872 0.23778,-0.13391 0.65524,-0.35974
         1.2883,-0.60358 0.63304,-0.24384 1.48167,-0.50555 2.3027,-0.67748 0.82104,-0.17194 1.61446,-0.25452
         2.49184,-0.31212 0.87737,-0.0576 1.83865,-0.0906 2.56211,-0.0966 0.72345,-0.006 1.20902,0.0137
         1.83141,0.0424 0.62241,0.0287 1.38164,0.066 2.30736,0.17776 0.92571,0.11176 2.01821,0.29815
         3.21634,0.58343 1.19813,0.28528 2.50199,0.66918 4.23695,1.35392 1.73496,0.68475 3.90075,1.66993
         4.98522,2.16421 1.08447,0.49468 1.08738,0.4977 1.09038,0.49868 0.003,9.9e-4 0.006,-1e-5
         0.60461,-1.78025 0.59897,-1.78013 1.79438,-5.33921 2.3921,-7.11895 v -5.2e-4 c 0.59721,-1.77827
         0.59728,-1.77946 0.60978,-1.85466 0.0125,-0.0752 0.0374,-0.22533 0.0501,-0.30283 0.0127,-0.0783
         0.0129,-0.0823 0.0108,-0.0863 -0.003,-0.004 -0.007,-0.007 -0.0114,-0.0103 -0.004,-0.003 -0.007,-0.005
         -0.0651,-0.0429 -0.058,-0.0383 -0.17122,-0.11295 -0.32918,-0.21756 -0.15795,-0.10471 -0.36083,-0.23953
         -0.88366,-0.5147 -0.52285,-0.27517 -1.36539,-0.6908 -2.2779,-1.07642 -0.91251,-0.38563 -1.8949,-0.74133
         -2.91249,-1.07332 -1.01759,-0.33199 -2.07051,-0.63986 -3.19515,-0.91881 -1.12464,-0.27895 -2.32102,-0.52882
         -3.37189,-0.71623 -1.05086,-0.18741 -1.95599,-0.31263 -3.10523,-0.40153 -1.14925,-0.0889 -2.54231,-0.14131
         -3.83129,-0.17001 -0.64449,-0.0147 -1.2633,-0.0227 -1.84434,-0.0217 z"
      />

      <path
        id="isfit-F"
        fill={logoColor(color).secondary ?? logoColor(color).primary}
        fillOpacity="1"
        stroke="none"
        strokeWidth="0.384336"
        strokeOpacity="1"
        d="m 165.7072,1.525495 v 5.2e-4 c -0.45069,-0.005 -0.86496,0.0344 -1.32085,0.0543 -0.30463,0.0632
      -0.61738,0.11165 -0.91467,0.20205 -0.55149,0.13915 -1.10268,0.2784 -1.65416,0.41755 -0.6763,0.19109
       -1.35254,0.38201 -2.02882,0.57309 -0.50165,0.14683 -1.00371,0.29345 -1.50534,0.44028 -0.67095,0.23554
        -1.34193,0.4714 -2.01279,0.70694 l -1.62419,0.67179 c -0.56615,0.2495 -1.1324,0.49878 -1.69861,0.74827
         -0.51214,0.30182 -1.02421,0.60356 -1.53634,0.90537 -0.59652,0.39454 -1.19312,0.7893 -1.78955,1.18391
          -0.39697,0.29408 -0.79372,0.58805 -1.19063,0.88212
      -0.29582,0.23837 -0.59147,0.47684 -0.88728,0.7152 -0.60012,0.56614 -1.20029,1.13247 -1.80041,1.6986
       -0.23813,0.20415 -0.47656,0.40821 -0.71468,0.61237 -0.46349,0.61633 -0.92662,1.23266 -1.3901,1.84898
        -0.36103,0.50622 -0.72212,1.01256 -1.08314,1.51877 -0.41173,0.64056 -0.82334,1.28078 -1.23506,1.92133
         -0.27298,0.46312 -0.5461,0.92648 -0.81908,1.38958 -0.22183,0.45038 -0.44378,0.90046 -0.66559,1.35082
          -0.48015,1.29509 -0.96009,2.59041 -1.44022,3.88556 -0.60293,1.92339 -1.20577,3.84675 -1.80868,5.77019
           -0.35768,1.35532 -0.71566,2.71061 -1.07332,4.0659
      -0.1528,0.91129 -0.30558,1.82293 -0.45837,2.7342 -0.23867,1.49984 -0.47704,2.99914 -0.71571,4.49895
       -0.10975,1.144 -0.21996,2.28838 -0.3297,3.43235 0.006,0.61098 -0.15018,1.19875 -0.14418,1.80971
        -0.0257,0.26637 -0.0434,0.53393 -0.0682,0.80046 l -18.81539,-0.0517 -0.88418,11.89229 18.69808,-0.0486 c
         -0.0392,0.43148 -0.0684,0.86441 -0.11007,1.29553 -0.0876,1.33385 -0.17502,2.66696 -0.26252,4.00079
          -0.13655,1.04026
          -0.27324,2.0805 -0.40979,3.12074 -0.0606,1.02958 -0.1213,2.05914 -0.1819,3.0887 -0.0788,0.86822
           -0.15736,1.7368 -0.23616,2.605 -0.17776,1.35477 -0.35553,2.70953 -0.5333,4.06436 -0.18587,1.58619
            -0.37172,3.17218 -0.55759,4.75836 -0.12845,1.15889 -0.25708,2.31741
      -0.38551,3.47628 -0.0899,1.02822 -0.17943,2.05739 -0.26923,3.0856 -0.13577,1.51176 -0.27198,3.02279
       -0.40773,4.5346 -0.1307,1.49804 -0.26102,2.9963 -0.39171,4.4943 -0.14587,1.56138 -0.29184,3.12261
        -0.4377,4.683945 -0.12602,1.31228 -0.25225,2.62447 -0.37827,3.93671 -0.13991,1.5508 -0.2797,3.10166
         -0.41961,4.65243 -0.18547,2.33681 -0.37109,4.67366 -0.55656,7.01043 -0.23239,2.02693 -0.46473,4.05344
          -0.69711,6.08025 -0.16153,1.82864 -0.32268,3.65745 -0.48421,5.48597 -0.24034,1.82957 -0.48105,3.65953
           -0.7214,5.48907 -0.20374,1.19978 -0.40759,2.399 -0.61133,3.59874 -0.17255,0.54167 -0.34473,1.08357
            -0.51728,1.62523 -0.18472,0.56072 -0.36977,1.12136 -0.55449,1.68207 -0.22956,0.46491 -0.45878,0.92983
       -0.68833,1.39474 -0.36948,0.72989 -0.73898,1.45966 -1.10846,2.18953 -0.21315,0.3455 -0.42661,0.69063
        -0.63976,1.03612 -0.47079,0.5623 -0.94153,1.12546 -1.41231,1.68775 -0.6017,0.62865 -1.20336,1.25653
         -1.80506,1.88515 -0.68073,0.4954 -1.36153,0.99135 -2.04225,1.48674 -0.86778,0.41257 -1.73518,0.82509
          -2.60295,1.23765 -0.79379,0.23837
      -1.58748,0.47684 -2.38125,0.7152 -0.61438,0.0942 -1.22892,0.18847 -1.84329,0.28267 l -4.74287,0.0491
       c -0.93715,-0.11386 -1.87406,-0.22772 -2.8112,-0.34158 -1.01686,-0.27705 -2.033585,-0.55391
        -3.050445,-0.83096 -0.60968,-0.26192 -1.21966,-0.52409 -1.82935,-0.786 l -3.46284,11.86801
         c 0,0 0.0783,0.17324 0.11731,0.25994 0.65551,0.24321 1.31079,0.48646 1.96629,0.72967 1.1297,0.3296
          2.25978,0.65948 3.38945,0.98908 0.97318,0.20628 1.946045,0.41229 2.919195,0.61857 0.80792,0.0792
           1.61571,0.15851 2.42363,0.23771 1.43125,0.0259 2.86257,0.0516 4.29379,0.0775 1.31162,-0.0574
            2.62358,-0.11469 3.93516,-0.17209 1.04824,-0.27281 2.09629,-0.54574 3.14451,-0.81855 l
             4.17649,-1.3441 c 1.16006,-0.45939
       2.31987,-0.91884 3.4799,-1.37821 1.3079,-0.74955 2.61592,-1.49891 3.92379,-2.24845 0.60875,-0.48129
        1.21751,-0.96257 1.82624,-1.44384 0.61275,-0.54693 1.2254,-1.0938 1.83813,-1.64072 0.63855,-0.65252
         1.27711,-1.30544 1.91565,-1.95802 0.85585,-1.18757 1.71145,-2.37496 2.56728,-3.56258 0.73613,-1.35914
          1.47253,-2.71866 2.20865,-4.07778 0.74021,-1.7716 1.48036,-3.54328
       2.22054,-5.31492 l 1.31206,-4.36149 c 0.29427,-1.38308 0.58838,-2.76606 0.88264,-4.14911 0.0765,-0.67748
        0.15294,-1.35497 0.22944,-2.03243 0.0471,-0.99106 0.0945,-1.98192 0.14159,-2.97294
        0.0933,-1.55523 0.27774,-3.07916
         0.37104,-4.63435 0.83536,-8.14483 1.57951,-16.32051 2.41484,-24.465165 0.59267,-6.70659
          1.18555,-13.41325 1.77819,-20.1197 0.69013,-6.96106 1.38005,-13.92204 2.07016,-20.88297
           l 21.50153,-0.0274 0.99425,-11.76518 -21.36097,0.0662 c 0.009,-0.0925 0.0179,-0.185
        0.0269,-0.2775 0.31004,-2.93576 0.62014,-5.87195 0.93018,-8.80774 0.19267,-1.38433 0.38551,-2.7684
         0.57826,-4.15271 0.40192,-1.41361 0.80371,-2.82744 1.20561,-4.24109 0.37503,-0.91734 0.74998,-1.83444
        1.12499,-2.75177 0.35272,-0.75456 0.70511,-1.50939 1.05782,-2.26394 0.54832,-0.91427 1.09707,-1.82866
         1.64538,-2.74299 0.55489,-0.67008 1.10954,-1.34014 1.6645,-2.01021 0.86164,-0.77219 1.72322,-1.54396
          2.58485,-2.31614 1.22046,-0.62982 2.44092,-1.26 3.66128,-1.88981 0.83635,-0.19608 1.67306,-0.39199
           2.5094,-0.58807 1.07289,-0.0681 2.14554,-0.13654 3.21841,-0.20464 0.80029,0.0472 1.60061,0.0949
            2.40089,0.14211 0.60932,0.0309 1.21847,0.0617 1.82779,0.0925 0.64922,0.0981 1.29848,0.19594
             1.94769,0.29404 l 0.43046,0.0894 c 0.56004,0.10291 1.11997,0.2056 1.68,0.30851 0.58846,0.15374
              1.17682,0.30773 1.76527,0.46147 0.45097,0.18476 0.90193,0.36921 1.35289,0.55397 0.35546,0.1515
               0.71115,0.30317
         1.0666,0.45475 0.1771,0.0781 0.52193,0.21911 0.52193,0.21911 l 0.0155,-0.21343 0.0196,-12.47107
          c 0,0 -0.49426,-0.22882 -0.74155,-0.34313 -1.30846,-0.42455 -2.61735,-0.84877 -3.92586,-1.27331
           -1.39956,-0.26461 -2.79927,-0.52914 -4.19871,-0.79375 -0.50539,-0.0512 -1.01029,-0.10228 -1.51567,-0.15348
            l -2.07584,0.006 -2.22932,0.008 c -0.92492,-0.006 -1.85012,-0.0121 -2.77503,-0.0181 z"
      />
      <path
        id="isfit-I-dot-2"
        fill={logoColor(color).primary ?? logoColor(color).secondary}
        fillOpacity="1"
        stroke="none"
        strokeWidth="0.384336"
        strokeOpacity="1"
        d="m 202.87082,8.143695 a 10.090732,10.090732 0 0 0 -10.09085,10.09086 10.090732,10.090732 0 0 0
     10.09085,10.09034 10.090732,10.090732 0 0 0 10.09086,-10.09034 10.090732,10.090732 0 0 0 -10.09086,-10.09086 z"
      />
      <path
        id="isfit-I-bar-2"
        fill={logoColor(color).primary ?? logoColor(color).secondary}
        fillOpacity="1"
        stroke="none"
        strokeWidth="0.384336"
        strokeOpacity="1"
        d="m 194.83876,41.950415 v 85.004625 h 16.31321 V 41.950415 Z"
      />
      <path
        id="isfit-T"
        fill={logoColor(color).primary ?? logoColor(color).secondary}
        fillOpacity="1"
        stroke="none"
        strokeWidth="0.384336"
        strokeOpacity="1"
        d="m 257.23701,21.795055 -15.76751,4.53254 h -0.11575 v 0.0336 l -0.007,0.002 h 0.007
      v 15.64194 h -13.78418 v 11.9972 h 13.78418 v 43.98802 c 0,2e-5 -0.002,-10e-6 -0.002,0
       2.2e-4,0.0195 4.3e-4,0.0541 5.2e-4,0.0713 0,0.002 0.002,0.12822 0.002,0.13022 v 0.13643 h
      0.002 c 4e-4,0.0492 -2.5e-4,0.014 0.0139,1.16685 0.0174,1.416255 0.0527,4.248875 0.1726,6.266285
       0.11993,2.01746 0.32496,3.21983 0.51987,4.16357 0.1949,0.94379 0.37966,1.62916 0.62476,2.51871
      0.24512,0.88958 0.55031,1.98334 0.97979,3.18482 0.42948,1.20148 0.98326,2.51037 1.63298,3.66437
       0.64971,1.154 1.39542,2.15291 2.49442,3.16673 1.09904,1.01382 2.55144,2.04254 3.41633,2.6448 0.86488,0.60226
        1.14216,0.77842 1.76526,1.07797 0.62311,0.29954 1.59187,0.72238 2.88045,1.12758 1.28861,0.40519 2.89716,0.79244
         4.64674,1.03301 1.74958,0.24061 3.63982,0.33512 5.59656,0.32712 1.95675,-0.008 3.9797,-0.11758
      5.26479,-0.21859 1.28509,-0.101 1.83256,-0.19357 2.72387,-0.35864
      0.8913,-0.16508 2.12654,-0.40266 3.06234,-0.61081
      0.93582,-0.20815 1.57205,-0.38699 1.8955,-0.47439 0.32318,-0.0874 0.33417,-0.083 0.32917,-2.10737
       -0.005,-2.02431 -0.0246,-6.07695 -0.0356,-8.1194 -0.011,-2.04241 -0.0131,-2.07511 -0.46302,-1.99781
        -0.4499,0.0773 -1.34777,0.26448 -2.39624,0.43511 -1.04848,0.17063 -2.24724,0.32509 -3.54397,0.44132
         -1.29673,0.11623 -2.69141,0.19413 -4.01061,0.15193 -1.31921,-0.0422 -2.56308,-0.20465 -3.70416,-0.53175
          -1.14104,-0.3271 -2.17917,-0.81873 -2.9745,-1.32757 -0.79533,-0.50884 -1.34765,-1.03489 -1.95905,-1.89911
           -0.61144,-0.86423 -1.28207,-2.06666 -1.76165,-3.31556 -0.47958,-1.2489 -0.76806,-2.54409 -0.96738,-3.95686
            -0.19932,-1.4128 -0.30942,-2.94294 -0.34262,-4.10001 -0.0332,-1.157065 0.0101,-1.940955 0.0181,-2.333185
             0,-0.008 -0.004,-0.0111 -0.004,-0.0191 h 0.007 v -44.32598 h 23.20943 v -11.9972 H 257.2379
              v -15.6378 h 10e-4 z"
      />
    </svg>
  );
}