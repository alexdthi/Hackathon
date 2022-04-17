import sys; args=sys.argv[1:]
from math import pi, acos, sin, cos
beginningLat, beginningLong = args[0], args[1]
goalDist = float(args[2])

# locations: (some sort of identifying name) (latitude) (longitude) ; txt file gabby style
# example: 5th8th 39.837 -77.381 # first 3 letters of street 1 followed by first 3 letters of street 2
# street 1 alphabetically ahead of street 2
# edges: (intersection1) (intersection2) (distance) ; txt file

rawLoc = open('intersectionLocations.txt', 'r').read().splitlines() ## change this to read the json file
rawEdges = open('intersectionNeighbors.txt', 'r').read().splitlines() ## same as above
locations = {} #get (lat, long) of an intersection
reverseLocs = {}
edges = {} #get the set of nearest intersections in each direction
for s in rawLoc:
    loc = s.split()
    locations[loc[0]] = (float(loc[1]), float(loc[2]))
    reverseLocs[(float(loc[1]), float(loc[2]))] = loc[0]

for node in rawEdges:
    n = node.split()
    if n[0] not in edges: edges[n[0]] = set()
    edges[n[0]].add((n[1],float(n[2]))) #(neighbor, distance)
    if n[1] not in edges: edges[n[1]] = set()
    edges[n[1]].add((n[0],float(n[2])))

def distEstimate(s1, s2):
    r = 3958.76 # in miles, equivalent to 6371 km
    y1 = s1[0]*pi/180.0
    x1 = s1[1]*pi/180.0
    y2 = s2[0]*pi/180.0
    x2 = s2[1]*pi/180.0
    return acos(sin(y1)*sin(y2) + cos(y1)*cos(y2)*cos(x2-x1)) * r #law of cosines

def neighbors(l):
    return edges[l]

def bdbfs(start):
    parseStart = [(start, 0)] #the start
    parseGoal = [(start, 0)] #the goal
    dictSeen1 = {start:(0, 0)} #prev; dist from start
    dictSeen2 = {start:(0, 0)} #prev; dist from goal
    while parseStart and parseGoal:
        sliderStart, d = parseStart.pop(0) #uses parse as a queue
        for i,dist in neighbors(sliderStart): #forwards direction bfs
            if(dictSeen1.get(i) is None): #not in dictionary
                dictSeen1[i]=(sliderStart,d+dist)
                parseStart.append(i) #check if neighbors are in dictseen2
            if i in dictSeen2 and dictSeen1[i][1]+dictSeen2[i][1]>=goalDist-0.2: #if the key was already found in the other dictionary
                return path(dictSeen1,i) + path(dictSeen2,i)[::-1]
        sliderGoal, d = parseGoal.pop(0)
        for i,dist in neighbors(sliderGoal): #reverse direction bfs
            if(dictSeen2.get(i) is None): #not in dictionary
                dictSeen2[i]=(sliderGoal,d+dist)
                parseGoal.append(i)
            if i in dictSeen1 and dictSeen1[i][1]+dictSeen2[i][1]>=goalDist-0.2: #if the key was already found in the other dictionary
                return path(dictSeen1,i) + path(dictSeen2,i)[::-1]

def path(dictSeen, start, end):
    toRet = []
    p = end
    while p!=start:
        p = dictSeen[p][0]
        toRet.append(p)
    return toRet[::-1]

def nearestPoint(lat, long):
    distlist = []
    for x,y in reverseLocs:
        distlist.append((distEstimate((lat,long), (x,y)), reverseLocs(x,y)))
    return min(distlist)[1]

beginning = nearestPoint(beginningLat, beginningLong)
start = locations[beginning]
print(f'Path: {bdbfs(start)}')
