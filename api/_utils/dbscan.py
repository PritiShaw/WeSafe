'''
    Original    : https://github.com/chrisjmccormick/dbscan/blob/master/dbscan.py
    Author      : Chris McCormick
    LICENSE     : MIT
'''
from math import sin, cos, sqrt, atan2, radians


class DBSCAN:
    
    def run(self, D, gps, eps=.2, MinPts=10):
        """
        Cluster the dataset `D` using the DBSCAN algorithm.

        MyDBSCAN takes a dataset `D` (a list of vectors), a threshold distance
        `eps`, and a required number of points `MinPts`.

        It will return a list of cluster labels. The label -1 means noise, and then
        the clusters are numbered starting from 1.
        """

        # This list will hold the final cluster assignment for each point in D.
        # There are two reserved values:
        #    -1 - Indicates a noise point
        #     0 - Means the point hasn't been considered yet.
        # Initially all labels are 0.
        labels = [0]*len(D)

        # C is the ID of the current cluster.
        C = 0

        # This outer loop is just responsible for picking new seed points--a point
        # from which to grow a new cluster.
        # Once a valid seed point is found, a new cluster is created, and the
        # cluster growth is all handled by the 'expandCluster' routine.

        # For each point P in the Dataset D...
        # ('P' is the index of the datapoint, rather than the datapoint itself.)
        for P in range(0, len(D)):

            # Only points that have not already been claimed can be picked as new
            # seed points.
            # If the point's label is not 0, continue to the next point.
            if not (labels[P] == 0):
                continue

            # Find all of P's neighboring points.
            NeighborPts = self.regionQuery(D, P, eps)

            # If the number is below MinPts, this point is noise.
            # This is the only condition under which a point is labeled
            # NOISE--when it's not a valid seed point. A NOISE point may later
            # be picked up by another cluster as a boundary point (this is the only
            # condition under which a cluster label can change--from NOISE to
            # something else).
            if len(NeighborPts) < MinPts:
                labels[P] = -1
            # Otherwise, if there are at least MinPts nearby, use this point as the
            # seed for a new cluster.
            else:
                C += 1
                self.growCluster(D, labels, P, NeighborPts, C, eps, MinPts)

        # All data has been clustered!

        safe_place_cord = self.findNearestCenter(labels, D, gps)
        return safe_place_cord

    def findNearestCenter(self, labels, D, gps):
        center_bucket = {}

        for idx in range(len(labels)):
            label = labels[idx]
            cordinate = D[idx]
            if label != -1:
                if label not in center_bucket:
                    center_bucket[label] = []
                center_bucket[label].append(cordinate)

        safe_place_cord = None
        min_distance_till_now = float("inf")

        for label, cordinates in center_bucket.items():
            latitude, longitude = 0, 0
            cordinates_length = len(cordinates)
            for cordinate in cordinates:
                latitude += cordinate[0]
                longitude += cordinate[1]

            avg_latitude = latitude/cordinates_length
            avg_longitude = longitude/cordinates_length

            center_cord = [avg_latitude, avg_longitude]

            distance_to_center = self.distance(gps, center_cord)

            if distance_to_center < min_distance_till_now:
                min_distance_till_now = distance_to_center
                safe_place_cord = center_cord

        return safe_place_cord

    def growCluster(self, D, labels, P, NeighborPts, C, eps, MinPts):
        """
        Grow a new cluster with label `C` from the seed point `P`.

        This function searches through the dataset to find all points that belong
        to this new cluster. When this function returns, cluster `C` is complete.

        Parameters:
        `D`      - The dataset (a list of vectors)
        `labels` - List storing the cluster labels for all dataset points
        `P`      - Index of the seed point for this new cluster
        `NeighborPts` - All of the neighbors of `P`
        `C`      - The label for this new cluster.  
        `eps`    - Threshold distance
        `MinPts` - Minimum required number of neighbors
        """

        # Assign the cluster label to the seed point.
        labels[P] = C

        # Look at each neighbor of P (neighbors are referred to as Pn).
        # NeighborPts will be used as a FIFO queue of points to search--that is, it
        # will grow as we discover new branch points for the cluster. The FIFO
        # behavior is accomplished by using a while-loop rather than a for-loop.
        # In NeighborPts, the points are represented by their index in the original
        # dataset.
        i = 0
        while i < len(NeighborPts):

            # Get the next point from the queue.
            Pn = NeighborPts[i]

            # If Pn was labelled NOISE during the seed search, then we
            # know it's not a branch point (it doesn't have enough neighbors), so
            # make it a leaf point of cluster C and move on.
            if labels[Pn] == -1:
                labels[Pn] = C

            # Otherwise, if Pn isn't already claimed, claim it as part of C.
            elif labels[Pn] == 0:
                # Add Pn to cluster C (Assign cluster label C).
                labels[Pn] = C

                # Find all the neighbors of Pn
                PnNeighborPts = self.regionQuery(D, Pn, eps)

                # If Pn has at least MinPts neighbors, it's a branch point!
                # Add all of its neighbors to the FIFO queue to be searched.
                if len(PnNeighborPts) >= MinPts:
                    NeighborPts = NeighborPts + PnNeighborPts
                # If Pn *doesn't* have enough neighbors, then it's a leaf point.
                # Don't queue up it's neighbors as expansion points.
                # else:
                    # Do nothing
                    #NeighborPts = NeighborPts

            # Advance to the next point in the FIFO queue.
            i += 1

        # We've finished growing cluster C!

    def regionQuery(self, D, P, eps):
        """
        Find all points in dataset `D` within distance `eps` of point `P`.

        This function calculates the distance between a point P and every other 
        point in the dataset, and then returns only those points which are within a
        threshold distance `eps`.
        """
        neighbors = []

        # For each point in the dataset...
        for Pn in range(0, len(D)):

            # If the distance is below the threshold, add it to the neighbors list.
            if self.distance(D[P], D[Pn]) <= eps:
                neighbors.append(Pn)

        return neighbors

    def distance(self, point_a, point_b):
        """
            Find the distance between two GPS coordinates
        """

        radius = 6373.0  # approximate radius of earth in km

        lat_a = radians(point_a[0])
        lon_a = radians(point_a[1])
        lat_b = radians(point_b[0])
        lon_b = radians(point_b[1])

        dlon = lon_b - lon_a
        dlat = lat_b - lat_a

        a = sin(dlat / 2)**2 + cos(lat_a) * cos(lat_b) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        distance = radius * c

        return distance
