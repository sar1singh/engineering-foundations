import { dsaTopic } from "@/data/content/enriched-factories";

export const phase61DsaExpansion = [
  dsaTopic({
    topicSlug: "linear-search",
    title: "Linear Search",
    pattern: "Single-pass scan with predicate",
    problems: [
      {
        id: "first-matching-record",
        title: "First matching record",
        difficulty: "easy",
        statement: "Given a list of records and a predicate, return the first index whose record satisfies the predicate. Return -1 when no record matches.",
        code: `export function firstMatchingIndex<T>(items: T[], matches: (item: T) => boolean): number {
  for (let index = 0; index < items.length; index += 1) {
    if (matches(items[index])) return index;
  }
  return -1;
}`,
        time: "O(n)",
        space: "O(1)"
      },
      {
        id: "count-threshold-crossings",
        title: "Count threshold crossings",
        difficulty: "easy",
        statement: "Given numbers and a threshold, count how many values are greater than or equal to the threshold while scanning only once.",
        code: `export function countAtLeast(values: number[], threshold: number): number {
  let count = 0;
  for (const value of values) {
    if (value >= threshold) count += 1;
  }
  return count;
}`,
        time: "O(n)",
        space: "O(1)"
      },
      {
        id: "longest-valid-prefix",
        title: "Longest valid prefix",
        difficulty: "medium",
        statement: "Given a stream of daily scores, return the length of the longest prefix where every score stays within an allowed minimum and maximum.",
        code: `export function longestValidPrefix(scores: number[], min: number, max: number): number {
  let length = 0;
  for (const score of scores) {
    if (score < min || score > max) break;
    length += 1;
  }
  return length;
}`,
        time: "O(n)",
        space: "O(1)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "sorting",
    title: "Sorting",
    pattern: "Sort then sweep",
    problems: [
      {
        id: "minimum-meeting-rooms",
        title: "Minimum meeting rooms",
        difficulty: "medium",
        statement: "Given meeting intervals, return the minimum number of rooms needed so no overlapping meetings share a room.",
        code: `export function minMeetingRooms(intervals: Array<[number, number]>): number {
  const starts = intervals.map(([start]) => start).sort((a, b) => a - b);
  const ends = intervals.map(([, end]) => end).sort((a, b) => a - b);
  let used = 0;
  let end = 0;
  for (const start of starts) {
    if (start < ends[end]) used += 1;
    else end += 1;
  }
  return used;
}`,
        time: "O(n log n)",
        space: "O(n)"
      },
      {
        id: "largest-number-order",
        title: "Largest concatenated number",
        difficulty: "medium",
        statement: "Given non-negative integers, arrange them so their concatenation forms the largest possible number.",
        code: `export function largestConcatenatedNumber(nums: number[]): string {
  const result = nums.map(String).sort((a, b) => (b + a).localeCompare(a + b)).join("");
  return result[0] === "0" ? "0" : result;
}`,
        time: "O(n log n)",
        space: "O(n)"
      },
      {
        id: "dedupe-after-sort",
        title: "Dedupe after sorting",
        difficulty: "easy",
        statement: "Given unsorted numbers, return a sorted list with duplicates removed.",
        code: `export function sortedUnique(nums: number[]): number[] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[] = [];
  for (const num of sorted) {
    if (result[result.length - 1] !== num) result.push(num);
  }
  return result;
}`,
        time: "O(n log n)",
        space: "O(n)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "tree-dfs",
    title: "Tree DFS",
    pattern: "Recursive subtree aggregation",
    problems: [
      {
        id: "max-depth",
        title: "Maximum tree depth",
        difficulty: "easy",
        statement: "Given a binary tree, return the number of nodes on the longest path from root to a leaf.",
        code: `type TreeNode = { value: number; left?: TreeNode | null; right?: TreeNode | null };
export function maxDepth(root?: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        time: "O(n)",
        space: "O(h)"
      },
      {
        id: "path-sum",
        title: "Root-to-leaf path sum",
        difficulty: "medium",
        statement: "Return true when a binary tree has a root-to-leaf path whose values sum to the target.",
        code: `type TreeNode = { value: number; left?: TreeNode | null; right?: TreeNode | null };
export function hasPathSum(root: TreeNode | null, target: number): boolean {
  if (!root) return false;
  if (!root.left && !root.right) return root.value === target;
  return hasPathSum(root.left ?? null, target - root.value) || hasPathSum(root.right ?? null, target - root.value);
}`,
        time: "O(n)",
        space: "O(h)"
      },
      {
        id: "validate-bst",
        title: "Validate BST with bounds",
        difficulty: "medium",
        statement: "Return true if every node in a binary tree respects binary-search-tree ordering using strict lower and upper bounds.",
        code: `type TreeNode = { value: number; left?: TreeNode | null; right?: TreeNode | null };
export function isValidBst(root: TreeNode | null, low = -Infinity, high = Infinity): boolean {
  if (!root) return true;
  if (root.value <= low || root.value >= high) return false;
  return isValidBst(root.left ?? null, low, root.value) && isValidBst(root.right ?? null, root.value, high);
}`,
        time: "O(n)",
        space: "O(h)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "tree-bfs",
    title: "Tree BFS",
    pattern: "Level-order queue traversal",
    problems: [
      {
        id: "level-order",
        title: "Level order traversal",
        difficulty: "easy",
        statement: "Return an array of levels where each level contains the values of tree nodes from left to right.",
        code: `type TreeNode = { value: number; left?: TreeNode | null; right?: TreeNode | null };
export function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  for (let head = 0; head < queue.length;) {
    const size = queue.length - head;
    const level: number[] = [];
    for (let i = 0; i < size; i += 1) {
      const node = queue[head++];
      level.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
        time: "O(n)",
        space: "O(n)"
      },
      {
        id: "right-side-view",
        title: "Right side view",
        difficulty: "medium",
        statement: "Return the visible node value at each depth when looking at the tree from the right side.",
        code: `type TreeNode = { value: number; left?: TreeNode | null; right?: TreeNode | null };
export function rightSideView(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];
  for (let head = 0; head < queue.length;) {
    const size = queue.length - head;
    for (let i = 0; i < size; i += 1) {
      const node = queue[head++];
      if (i === size - 1) result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
}`,
        time: "O(n)",
        space: "O(n)"
      },
      {
        id: "minimum-depth",
        title: "Minimum depth",
        difficulty: "easy",
        statement: "Return the shortest number of nodes from root to any leaf using level-order traversal.",
        code: `type TreeNode = { value: number; left?: TreeNode | null; right?: TreeNode | null };
export function minDepth(root: TreeNode | null): number {
  if (!root) return 0;
  const queue: Array<[TreeNode, number]> = [[root, 1]];
  for (let head = 0; head < queue.length; head += 1) {
    const [node, depth] = queue[head];
    if (!node.left && !node.right) return depth;
    if (node.left) queue.push([node.left, depth + 1]);
    if (node.right) queue.push([node.right, depth + 1]);
  }
  return 0;
}`,
        time: "O(n)",
        space: "O(n)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "graph-dfs",
    title: "Graph DFS",
    pattern: "Visited-set depth-first traversal",
    problems: [
      {
        id: "connected-components",
        title: "Count connected components",
        difficulty: "medium",
        statement: "Given n nodes and undirected edges, return the number of connected components.",
        code: `export function countComponents(n: number, edges: Array<[number, number]>): number {
  const graph = Array.from({ length: n }, () => [] as number[]);
  for (const [a, b] of edges) { graph[a].push(b); graph[b].push(a); }
  const seen = new Set<number>();
  const dfs = (node: number) => {
    if (seen.has(node)) return;
    seen.add(node);
    for (const next of graph[node]) dfs(next);
  };
  let count = 0;
  for (let node = 0; node < n; node += 1) if (!seen.has(node)) { count += 1; dfs(node); }
  return count;
}`,
        time: "O(V + E)",
        space: "O(V + E)"
      },
      {
        id: "island-area",
        title: "Largest island area",
        difficulty: "medium",
        statement: "Given a grid of land and water, return the size of the largest connected land region using four-direction movement.",
        code: `export function maxIslandArea(grid: number[][]): number {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  const visit = (r: number, c: number): number => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return 0;
    grid[r][c] = 0;
    return 1 + visit(r + 1, c) + visit(r - 1, c) + visit(r, c + 1) + visit(r, c - 1);
  };
  let best = 0;
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) best = Math.max(best, visit(r, c));
  return best;
}`,
        time: "O(rows * cols)",
        space: "O(rows * cols)"
      },
      {
        id: "directed-cycle",
        title: "Detect directed cycle",
        difficulty: "medium",
        statement: "Given a directed graph represented as adjacency lists, return true if it contains at least one cycle and false when every dependency path eventually terminates.",
        code: `export function hasDirectedCycle(graph: Map<number, number[]>): boolean {
  const visiting = new Set<number>();
  const visited = new Set<number>();
  const dfs = (node: number): boolean => {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) if (dfs(next)) return true;
    visiting.delete(node);
    visited.add(node);
    return false;
  };
  for (const node of graph.keys()) if (dfs(node)) return true;
  return false;
}`,
        time: "O(V + E)",
        space: "O(V)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "topological-sort",
    title: "Topological Sort",
    pattern: "Kahn indegree ordering",
    problems: [
      {
        id: "course-order",
        title: "Course order",
        difficulty: "medium",
        statement: "Given courses and prerequisite pairs, return one valid order to complete all courses or an empty array if impossible.",
        code: `export function courseOrder(count: number, prerequisites: Array<[number, number]>): number[] {
  const graph = Array.from({ length: count }, () => [] as number[]);
  const indegree = Array(count).fill(0);
  for (const [course, pre] of prerequisites) { graph[pre].push(course); indegree[course] += 1; }
  const queue = indegree.flatMap((degree, node) => degree === 0 ? [node] : []);
  const order: number[] = [];
  for (let head = 0; head < queue.length; head += 1) {
    const node = queue[head];
    order.push(node);
    for (const next of graph[node]) if (--indegree[next] === 0) queue.push(next);
  }
  return order.length === count ? order : [];
}`,
        time: "O(V + E)",
        space: "O(V + E)"
      },
      {
        id: "build-stages",
        title: "Build stage ordering",
        difficulty: "medium",
        statement: "Given build stages and dependency edges, return a valid stage execution order.",
        code: `export function orderStages(stages: string[], deps: Array<[string, string]>): string[] {
  const graph = new Map(stages.map((stage) => [stage, [] as string[]]));
  const indegree = new Map(stages.map((stage) => [stage, 0]));
  for (const [before, after] of deps) { graph.get(before)!.push(after); indegree.set(after, indegree.get(after)! + 1); }
  const queue = stages.filter((stage) => indegree.get(stage) === 0);
  const order: string[] = [];
  for (let head = 0; head < queue.length; head += 1) {
    const stage = queue[head];
    order.push(stage);
    for (const next of graph.get(stage)!) if (indegree.set(next, indegree.get(next)! - 1).get(next) === 0) queue.push(next);
  }
  return order.length === stages.length ? order : [];
}`,
        time: "O(V + E)",
        space: "O(V + E)"
      },
      {
        id: "alien-dictionary-lite",
        title: "Alien dictionary lite",
        difficulty: "hard",
        statement: "Given sorted words in an unknown alphabet, infer a valid character ordering when possible.",
        code: `export function alienOrder(words: string[]): string {
  const chars = new Set(words.join(""));
  const graph = new Map([...chars].map((char) => [char, [] as string[]]));
  const indegree = new Map([...chars].map((char) => [char, 0]));
  for (let i = 1; i < words.length; i += 1) {
    const a = words[i - 1], b = words[i];
    const limit = Math.min(a.length, b.length);
    let found = false;
    for (let j = 0; j < limit; j += 1) if (a[j] !== b[j]) { graph.get(a[j])!.push(b[j]); indegree.set(b[j], indegree.get(b[j])! + 1); found = true; break; }
    if (!found && a.length > b.length) return "";
  }
  const queue = [...chars].filter((char) => indegree.get(char) === 0);
  let order = "";
  for (let head = 0; head < queue.length; head += 1) {
    const char = queue[head];
    order += char;
    for (const next of graph.get(char)!) if (indegree.set(next, indegree.get(next)! - 1).get(next) === 0) queue.push(next);
  }
  return order.length === chars.size ? order : "";
}`,
        time: "O(total characters + edges)",
        space: "O(unique characters + edges)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "dijkstra",
    title: "Dijkstra",
    pattern: "Greedy shortest path with non-negative weights",
    problems: [
      {
        id: "network-delay",
        title: "Network delay from source",
        difficulty: "medium",
        statement: "Given directed weighted edges and a source, return the time for all nodes to receive a signal or -1 if any node is unreachable.",
        code: `export function networkDelay(n: number, edges: Array<[number, number, number]>, source: number): number {
  const graph = Array.from({ length: n + 1 }, () => [] as Array<[number, number]>);
  for (const [from, to, cost] of edges) graph[from].push([to, cost]);
  const dist = Array(n + 1).fill(Infinity);
  dist[source] = 0;
  const pq: Array<[number, number]> = [[0, source]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, node] = pq.shift()!;
    if (cost !== dist[node]) continue;
    for (const [next, weight] of graph[node]) if (cost + weight < dist[next]) { dist[next] = cost + weight; pq.push([dist[next], next]); }
  }
  const answer = Math.max(...dist.slice(1));
  return Number.isFinite(answer) ? answer : -1;
}`,
        time: "O((V + E) log E) with simple sorted queue",
        space: "O(V + E)"
      },
      {
        id: "cheapest-route",
        title: "Cheapest route",
        difficulty: "medium",
        statement: "Given a weighted graph, return the cheapest cost between a start and target node when all edge costs are non-negative.",
        code: `export function cheapestRoute(graph: Map<string, Array<[string, number]>>, start: string, target: string): number {
  const dist = new Map<string, number>([[start, 0]]);
  const pq: Array<[number, string]> = [[0, start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, node] = pq.shift()!;
    if (node === target) return cost;
    if (cost !== dist.get(node)) continue;
    for (const [next, weight] of graph.get(node) ?? []) if (cost + weight < (dist.get(next) ?? Infinity)) { dist.set(next, cost + weight); pq.push([cost + weight, next]); }
  }
  return -1;
}`,
        time: "O((V + E) log E)",
        space: "O(V + E)"
      },
      {
        id: "minimum-risk-path",
        title: "Minimum risk grid path",
        difficulty: "hard",
        statement: "Given a grid of non-negative risk values, return the minimum total risk to travel from top-left to bottom-right.",
        code: `export function minRiskPath(grid: number[][]): number {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const pq: Array<[number, number, number]> = [[grid[0][0], 0, 0]];
  dist[0][0] = grid[0][0];
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, row, col] = pq.shift()!;
    if (row === rows - 1 && col === cols - 1) return cost;
    if (cost !== dist[row][col]) continue;
    for (const [dr, dc] of dirs) {
      const nr = row + dr, nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && cost + grid[nr][nc] < dist[nr][nc]) { dist[nr][nc] = cost + grid[nr][nc]; pq.push([dist[nr][nc], nr, nc]); }
    }
  }
  return -1;
}`,
        time: "O((R*C) log(R*C))",
        space: "O(R*C)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "union-find",
    title: "Union Find",
    pattern: "Disjoint-set connectivity",
    problems: [
      {
        id: "redundant-edge",
        title: "Find redundant edge",
        difficulty: "medium",
        statement: "Given undirected edges that form a tree plus one extra edge, return the first edge that creates a cycle.",
        code: `export function redundantEdge(edges: Array<[number, number]>): [number, number] | null {
  const parent = new Map<number, number>();
  const find = (x: number): number => { if (!parent.has(x)) parent.set(x, x); if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!)); return parent.get(x)!; };
  for (const [a, b] of edges) {
    const pa = find(a), pb = find(b);
    if (pa === pb) return [a, b];
    parent.set(pa, pb);
  }
  return null;
}`,
        time: "O(E alpha(V))",
        space: "O(V)"
      },
      {
        id: "accounts-merge-lite",
        title: "Merge account ids",
        difficulty: "medium",
        statement: "Given pairs of equivalent account ids, return groups of ids that belong to the same connected account.",
        code: `export function mergeIds(pairs: Array<[string, string]>): string[][] {
  const parent = new Map<string, string>();
  const find = (x: string): string => { if (!parent.has(x)) parent.set(x, x); if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!)); return parent.get(x)!; };
  for (const [a, b] of pairs) parent.set(find(a), find(b));
  const groups = new Map<string, string[]>();
  for (const id of parent.keys()) { const root = find(id); groups.set(root, [...(groups.get(root) ?? []), id]); }
  return [...groups.values()].map((group) => group.sort());
}`,
        time: "O(n alpha(n))",
        space: "O(n)"
      },
      {
        id: "component-count-after-unions",
        title: "Component count after unions",
        difficulty: "easy",
        statement: "Given n isolated nodes and union operations, return the number of connected components after all operations.",
        code: `export function componentsAfterUnions(n: number, unions: Array<[number, number]>): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => parent[x] === x ? x : (parent[x] = find(parent[x]));
  let count = n;
  for (const [a, b] of unions) { const pa = find(a), pb = find(b); if (pa !== pb) { parent[pa] = pb; count -= 1; } }
  return count;
}`,
        time: "O(n + u alpha(n))",
        space: "O(n)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "recursion-backtracking",
    title: "Recursion and Backtracking",
    pattern: "Choose, explore, undo",
    problems: [
      {
        id: "subsets",
        title: "Generate subsets",
        difficulty: "medium",
        statement: "Given a list of distinct numbers, return every possible subset including the empty set and the full set while preserving a clear choose-or-skip recursion tree.",
        code: `export function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const dfs = (index: number) => {
    if (index === nums.length) { result.push([...path]); return; }
    dfs(index + 1);
    path.push(nums[index]);
    dfs(index + 1);
    path.pop();
  };
  dfs(0);
  return result;
}`,
        time: "O(n * 2^n)",
        space: "O(n)"
      },
      {
        id: "combinations-sum",
        title: "Combination sum without reuse",
        difficulty: "medium",
        statement: "Given candidates and a target, return combinations that sum to target using each candidate at most once.",
        code: `export function combinationSumOnce(nums: number[], target: number): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];
  const dfs = (start: number, remaining: number) => {
    if (remaining === 0) { result.push([...path]); return; }
    for (let i = start; i < nums.length && nums[i] <= remaining; i += 1) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]); dfs(i + 1, remaining - nums[i]); path.pop();
    }
  };
  dfs(0, target);
  return result;
}`,
        time: "O(2^n)",
        space: "O(n)"
      },
      {
        id: "word-search-lite",
        title: "Word search lite",
        difficulty: "medium",
        statement: "Given a board and word, return true when the word can be formed by adjacent cells without reusing a cell.",
        code: `export function existsWord(board: string[][], word: string): boolean {
  const rows = board.length, cols = board[0]?.length ?? 0;
  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i]) return false;
    const char = board[r][c]; board[r][c] = "#";
    const ok = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = char;
    return ok;
  };
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) if (dfs(r, c, 0)) return true;
  return false;
}`,
        time: "O(R*C*4^L)",
        space: "O(L)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "intervals",
    title: "Intervals",
    pattern: "Sort by boundary then merge/sweep",
    problems: [
      {
        id: "merge-intervals",
        title: "Merge overlapping intervals",
        difficulty: "medium",
        statement: "Given intervals, merge all overlapping ranges and return non-overlapping intervals sorted by start.",
        code: `export function mergeIntervals(intervals: Array<[number, number]>): Array<[number, number]> {
  intervals.sort((a, b) => a[0] - b[0]);
  const result: Array<[number, number]> = [];
  for (const [start, end] of intervals) {
    const last = result[result.length - 1];
    if (!last || start > last[1]) result.push([start, end]);
    else last[1] = Math.max(last[1], end);
  }
  return result;
}`,
        time: "O(n log n)",
        space: "O(n)"
      },
      {
        id: "erase-overlap",
        title: "Erase overlapping intervals",
        difficulty: "medium",
        statement: "Return the minimum number of intervals to remove so the remaining intervals do not overlap.",
        code: `export function eraseOverlap(intervals: Array<[number, number]>): number {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let end = -Infinity;
  for (const [start, finish] of intervals) {
    if (start < end) removed += 1;
    else end = finish;
  }
  return removed;
}`,
        time: "O(n log n)",
        space: "O(1)"
      },
      {
        id: "insert-interval",
        title: "Insert interval",
        difficulty: "medium",
        statement: "Given sorted non-overlapping intervals and a new interval, insert and merge where needed.",
        code: `export function insertInterval(intervals: Array<[number, number]>, next: [number, number]): Array<[number, number]> {
  const result: Array<[number, number]> = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < next[0]) result.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= next[1]) { next = [Math.min(next[0], intervals[i][0]), Math.max(next[1], intervals[i][1])]; i += 1; }
  result.push(next);
  while (i < intervals.length) result.push(intervals[i++]);
  return result;
}`,
        time: "O(n)",
        space: "O(n)"
      }
    ]
  }),
  dsaTopic({
    topicSlug: "bit-manipulation",
    title: "Bit Manipulation",
    pattern: "Bit mask and XOR invariants",
    problems: [
      {
        id: "single-number",
        title: "Single number",
        difficulty: "easy",
        statement: "Every number appears twice except one. Return the number that appears once.",
        code: `export function singleNumber(nums: number[]): number {
  let answer = 0;
  for (const num of nums) answer ^= num;
  return answer;
}`,
        time: "O(n)",
        space: "O(1)"
      },
      {
        id: "count-bits",
        title: "Count set bits",
        difficulty: "easy",
        statement: "Return the number of 1 bits in the binary representation of a non-negative integer.",
        code: `export function countSetBits(num: number): number {
  let count = 0;
  while (num !== 0) {
    num &= num - 1;
    count += 1;
  }
  return count;
}`,
        time: "O(number of set bits)",
        space: "O(1)"
      },
      {
        id: "permission-mask",
        title: "Permission mask check",
        difficulty: "medium",
        statement: "Given a user's permission mask and a required mask, return true when all required permissions are present.",
        code: `export function hasPermissions(userMask: number, requiredMask: number): boolean {
  return (userMask & requiredMask) === requiredMask;
}`,
        time: "O(1)",
        space: "O(1)"
      }
    ]
  })
];
