import sys; args = sys.argv[1:]
#input: mile time (mm:ss.__ or seconds), endurance level (0,1,2), distance of run, type of run (0,1,2,3)
endurance, dist, runtype = int(args[1]), float(args[2]), int(args[3])
if ':' in args[0]:
    m = args[0].split(':')
    mileTime = 60*float(m[0]) + float(m[1])
else: mileTime = float(args[0])

def timeEst(mileTime, endureConst, dist):
    return mileTime*dist**endureConst

endureConsts = [1.15, 1.11, 1.07, 1.0] #beginner, good, great, irrelevant (for tempo and other workout paces)
speeds = [1, 0.09+endureConsts[endurance], 1.28, 1.45] #race pace, tempo, easy, recovery

if runtype == 1: timereqd = timeEst(mileTime*speeds[1], endureConsts[3], dist)
else: timereqd = timeEst(mileTime*speeds[runtype], endureConsts[endurance], dist)

print(f'Time: {round(timereqd)//60} minutes, {round(timereqd)%60} seconds')