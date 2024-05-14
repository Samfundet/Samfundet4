from __future__ import annotations


class PermissionDictionary:
    def __init__(self, dictionary: dict):
        self.dict = {k: set(v) for k, v in dictionary.items()}
        self.index_array = list(dictionary.keys())

    def __getitem__(self, key: int) -> str:
        return ''.join(sorted(self.dict[self.index_array[key]]))

    def __str__(self) -> str:
        return str({k: ''.join(sorted(v)) for k, v in self.dict.items()})

    def get(self, index: int) -> set:
        return self.dict[self.index_array[index]]

    def set(self, key: str, value: str) -> None:
        if key in self.dict:
            self.dict[key].update(value)
        else:
            raise KeyError('Key not found in permissions dictionary')

    def get_index_array(self) -> list:
        return self.index_array


class Graph:
    def __init__(self, vertices: int, graph: list):
        self.V = vertices
        self.graph = graph

    def __str__(self) -> str:
        matrix_str = ''
        for row in self.graph:
            for value in row:
                matrix_str += '%7d\t' % value
            matrix_str += '\n'
        return matrix_str

    def compute_permissions(self, permissions: PermissionDictionary) -> PermissionDictionary:
        reach = [row[:] for row in self.graph]
        index_array = permissions.get_index_array()

        for k in range(self.V):
            for i in range(self.V):
                for j in range(self.V):
                    if reach[i][j] or (reach[i][k] and reach[k][j]):
                        reach[i][j] = 1
                        permissions.set(index_array[j], permissions.get(i))
        # Update the graph's own matrix to reflect the transitive closure
        self.graph = reach
        return permissions
