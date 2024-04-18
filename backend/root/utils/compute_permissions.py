from collections import OrderedDict
# TODO:use collections? improve performance?


class Permissions:
    # FIX: permissions added multipletimes.
    def __init__(self, dictionary):
        self.dict = dictionary
        self.index_array = list(dictionary.keys())

    def __getitem__(self, key):
        return self.dict[key]

    def __str__(self):
        return str(self.dict)

    def get(self, index):
        return self.dict[self.index_array[index]]

    def set(self, key, value):
        self.dict[key] = value

    def get_index_array(self):
        return self.index_array

    def clean(self):
        for key, value in self.dict.items():
            self.dict[key] = "".join(sorted(set(value)))


class Graph:
    def __init__(self, vertices):
        self.V = vertices

    def printAdjMatrix(self, reach):
        print("Following matrix transitive closure of the given graph ")
        for i in range(self.V):
            for j in range(self.V):
                if i == j:
                    print("%7d\t" % (1), end=" ")
                else:
                    print("%7d\t" % (reach[i][j]), end=" ")
            print()

    def compute_permissions(self, graph, permissions):
        reach = [i[:] for i in graph]
        index_array = permissions.get_index_array()

        for k in range(self.V):
            for i in range(self.V):
                for j in range(self.V):
                    reach[i][j] = reach[i][j] or (reach[i][k] and reach[k][j])
                    if reach[i][j] == 1:
                        permissions.set(
                            index_array[j],
                            permissions.get(j) + permissions[index_array[i]],
                        )

        self.printAdjMatrix(reach)
        print("")

        permissions.clean()
        print(permissions)

        return permissions


g = Graph(5)

graph = [
    [1, 0, 1, 0, 0],
    [0, 1, 1, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
]

p = Permissions(
    {
        "Ansatt": "B",
        "Hest": "A",
        "Mellomleder": "C",
        "Sjef": "D",
        "Baltazar": "E",
    }
)
g.compute_permissions(graph, p)
