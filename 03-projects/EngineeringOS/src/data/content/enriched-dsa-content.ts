import type { EnrichedPracticeProblem, EnrichedTopicContent } from "@/types/enriched-content";

function problem(input: Omit<EnrichedPracticeProblem, "solutionLanguage">): EnrichedPracticeProblem {
  return { ...input, solutionLanguage: "typescript" };
}

const twoSumFrequency = problem({
  id: "enriched-hashmap-two-sum-frequency",
  title: "Find pair with target sum using a frequency map",
  sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
  originalStatement: "Given an array of numbers and a target, return the indexes of two different values whose sum equals the target. If multiple answers exist, return any one.",
  pattern: "HashMap complement lookup",
  difficulty: "easy",
  hints: ["Store what you have already seen.", "For each value, ask whether target - value already exists.", "Return indexes, not values."],
  approach: [
    "Create a map from number to index.",
    "Scan left to right so each candidate only pairs with earlier values.",
    "For the current value, compute the complement.",
    "If complement exists, return the stored index and current index.",
    "Otherwise store the current value and continue."
  ],
  solution: `export function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();

  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index];
    const complement = target - value;

    if (seen.has(complement)) {
      return [seen.get(complement)!, index];
    }

    seen.set(value, index);
  }

  return null;
}`,
  complexity: { time: "O(n)", space: "O(n)" },
  testCases: ["twoSum([2,7,11,15], 9) -> [0,1]", "twoSum([3,3], 6) -> [0,1]", "twoSum([1,2,3], 7) -> null"],
  commonMistakes: ["Using the same element twice.", "Returning values when the prompt asks for indexes.", "Building a nested loop and missing the O(n) optimization."],
  interviewNarration: "I will trade memory for speed. The invariant is that the map contains all values to the left of the current index, so if the complement is present I have a valid pair without reusing the current element."
});

const topKFrequent = problem({
  id: "enriched-hashmap-top-k-frequent",
  title: "Top K frequent elements",
  sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
  originalStatement: "Return the k values that appear most often in an array. The order of the returned values does not matter.",
  pattern: "Frequency map plus bucket sort",
  difficulty: "medium",
  hints: ["Count first, rank second.", "A value can occur at most n times.", "Buckets avoid sorting all unique values."],
  approach: [
    "Count each number in a Map.",
    "Create buckets where index is frequency and value is a list of numbers with that frequency.",
    "Walk buckets from high frequency to low.",
    "Collect values until k results are found."
  ],
  solution: `export function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const num of nums) counts.set(num, (counts.get(num) ?? 0) + 1);

  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of counts) buckets[count].push(num);

  const result: number[] = [];
  for (let freq = buckets.length - 1; freq >= 0 && result.length < k; freq -= 1) {
    for (const num of buckets[freq]) {
      result.push(num);
      if (result.length === k) return result;
    }
  }

  return result;
}`,
  complexity: { time: "O(n)", space: "O(n)" },
  testCases: ["topKFrequent([1,1,1,2,2,3], 2) -> [1,2]", "topKFrequent([5], 1) -> [5]", "topKFrequent([4,4,6,6,7], 2) -> [4,6]"],
  commonMistakes: ["Sorting the whole array instead of unique counts.", "Forgetting ties can be returned in any order.", "Creating buckets sized by unique count instead of max possible frequency."],
  interviewNarration: "The key observation is that frequencies are bounded by n. I count with a hash map, then use frequency buckets to avoid O(u log u) sorting when a linear solution is possible."
});

const graphBfsShortestPath = problem({
  id: "enriched-graph-bfs-shortest-path-grid",
  title: "Shortest path in a binary grid",
  sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
  originalStatement: "Given a grid where 0 means open and 1 means blocked, return the minimum number of moves from the top-left cell to the bottom-right cell using four directions. Return -1 if unreachable.",
  pattern: "Graph BFS over implicit grid graph",
  difficulty: "medium",
  hints: ["Each cell is a graph node.", "Use a queue because every move has equal cost.", "Mark visited when enqueuing, not when dequeuing."],
  approach: [
    "Reject empty, blocked start, or blocked target grids.",
    "Push the start cell with distance zero.",
    "For each dequeued cell, try four neighbors.",
    "If a neighbor is inside bounds, open, and unseen, mark it seen and enqueue distance + 1.",
    "The first time the target is reached is the shortest path."
  ],
  solution: `export function shortestPathGrid(grid: number[][]): number {
  if (grid.length === 0 || grid[0].length === 0) return -1;
  const rows = grid.length;
  const cols = grid[0].length;
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;

  const queue: Array<[number, number, number]> = [[0, 0, 0]];
  const seen = new Set<string>(["0,0"]);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let head = 0; head < queue.length; head += 1) {
    const [row, col, dist] = queue[head];
    if (row === rows - 1 && col === cols - 1) return dist;

    for (const [dr, dc] of dirs) {
      const nextRow = row + dr;
      const nextCol = col + dc;
      const key = \`\${nextRow},\${nextCol}\`;
      const inside = nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols;
      if (inside && grid[nextRow][nextCol] === 0 && !seen.has(key)) {
        seen.add(key);
        queue.push([nextRow, nextCol, dist + 1]);
      }
    }
  }

  return -1;
}`,
  complexity: { time: "O(rows * cols)", space: "O(rows * cols)" },
  testCases: ["[[0,0],[1,0]] -> 2", "[[0,1],[1,0]] -> -1", "[[0]] -> 0"],
  commonMistakes: ["Using DFS and returning a non-shortest path.", "Marking visited only after dequeue, causing duplicate queue entries.", "Forgetting blocked start or target cells."],
  interviewNarration: "Because all moves cost one, BFS is the correct shortest-path tool. I model each open cell as a node and each valid neighbor as an edge, then rely on BFS layer order for correctness."
});

const binarySearchAnswer = problem({
  id: "enriched-binary-search-min-capacity",
  title: "Minimum feasible capacity",
  sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
  originalStatement: "Given package weights and a number of days, find the smallest ship capacity that can deliver all packages in order within the given days.",
  pattern: "Binary search on answer",
  difficulty: "medium",
  hints: ["The answer is not an index; it is a capacity.", "If capacity C works, any larger capacity also works.", "Lower bound is max weight; upper bound is sum of weights."],
  approach: [
    "Define a feasibility function that counts days needed for a capacity.",
    "Search between max(weights) and sum(weights).",
    "If mid capacity is feasible, keep it and search smaller.",
    "If not feasible, search larger.",
    "Return the smallest feasible capacity."
  ],
  solution: `export function minShipCapacity(weights: number[], days: number): number {
  let left = Math.max(...weights);
  let right = weights.reduce((sum, weight) => sum + weight, 0);

  const canShip = (capacity: number) => {
    let usedDays = 1;
    let load = 0;
    for (const weight of weights) {
      if (load + weight > capacity) {
        usedDays += 1;
        load = 0;
      }
      load += weight;
    }
    return usedDays <= days;
  };

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canShip(mid)) right = mid;
    else left = mid + 1;
  }

  return left;
}`,
  complexity: { time: "O(n log(sum(weights)))", space: "O(1)" },
  testCases: ["minShipCapacity([1,2,3,4,5,6,7,8,9,10], 5) -> 15", "minShipCapacity([3,2,2,4,1,4], 3) -> 6", "minShipCapacity([5], 1) -> 5"],
  commonMistakes: ["Using 0 as the lower bound and accepting impossible capacities.", "Breaking item order in the feasibility check.", "Returning the first feasible mid rather than the minimum feasible value."],
  interviewNarration: "I recognize a monotonic predicate: if a capacity works, every larger capacity works. That turns an optimization problem into binary search over the answer range."
});

const dpCoinChange = problem({
  id: "enriched-dp-coin-change",
  title: "Minimum coins for a target amount",
  sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
  originalStatement: "Given coin denominations and an amount, return the minimum number of coins needed to make the amount. Return -1 if it cannot be made.",
  pattern: "One-dimensional dynamic programming",
  difficulty: "medium",
  hints: ["Let dp[x] mean the best answer for amount x.", "Initialize unreachable states with Infinity.", "Each coin tries to improve future amounts."],
  approach: [
    "Create dp from 0 to amount, filled with Infinity.",
    "Set dp[0] = 0 because zero coins make amount zero.",
    "For every subtotal, try each coin.",
    "If subtotal - coin is reachable, update dp[subtotal].",
    "Return dp[amount] unless it is still Infinity."
  ],
  solution: `export function coinChange(coins: number[], amount: number): number {
  const dp = Array(amount + 1).fill(Number.POSITIVE_INFINITY);
  dp[0] = 0;

  for (let subtotal = 1; subtotal <= amount; subtotal += 1) {
    for (const coin of coins) {
      if (subtotal - coin >= 0) {
        dp[subtotal] = Math.min(dp[subtotal], dp[subtotal - coin] + 1);
      }
    }
  }

  return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}`,
  complexity: { time: "O(amount * coinCount)", space: "O(amount)" },
  testCases: ["coinChange([1,2,5], 11) -> 3", "coinChange([2], 3) -> -1", "coinChange([1], 0) -> 0"],
  commonMistakes: ["Using greedy for arbitrary denominations.", "Forgetting dp[0] = 0.", "Returning Infinity instead of -1 for unreachable targets."],
  interviewNarration: "I define the subproblem as the best answer for every smaller amount. Each amount depends on amount minus one chosen coin, so bottom-up DP gives a clean recurrence."
});

const phase61DsaProblems = {
  arraysStrings: problem({
    id: "enriched-arrays-strings-product-except-self",
    title: "Product of array except current index",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given an integer array, return a new array where each position contains the product of every input value except the value at that same position, without using division.",
    pattern: "Prefix and suffix products",
    difficulty: "medium",
    hints: ["The left side and right side can be computed independently.", "The output array can temporarily store prefix products.", "A reverse pass can multiply suffix products into the same output."],
    approach: ["Create an output array initialized with 1.", "Scan left to right, storing product of all values before each index.", "Scan right to left with a running suffix product.", "Multiply the suffix into the output at each index.", "Return the completed output."],
    solution: `export function productExceptSelf(nums: number[]): number[] {
  const result = Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i += 1) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i -= 1) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}`,
    complexity: { time: "O(n)", space: "O(1) extra excluding output" },
    testCases: ["productExceptSelf([1,2,3,4]) -> [24,12,8,6]", "productExceptSelf([0,2,3]) -> [6,0,0]", "productExceptSelf([-1,1,0,-3,3]) -> [0,0,9,0,0]"],
    commonMistakes: ["Using division and failing zero cases.", "Counting the output array as avoidable extra storage.", "Forgetting to update suffix after multiplying the result."],
    interviewNarration: "I avoid division by splitting the product into everything left of the index and everything right of it. Two linear passes preserve that invariant and handle zeros naturally."
  }),
  stack: problem({
    id: "enriched-stack-valid-brackets",
    title: "Validate nested brackets",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given a string containing only bracket characters, determine whether every opening bracket is closed by the same type of bracket in the correct nested order.",
    pattern: "Stack for last-open first-closed matching",
    difficulty: "easy",
    hints: ["The most recent unmatched opener must be closed first.", "Push opening characters.", "On a closing character, compare against the stack top."],
    approach: ["Create a map from closing bracket to required opening bracket.", "Push every opening bracket onto a stack.", "For every closing bracket, pop and compare with the required opener.", "Return false on mismatch or premature closing.", "At the end, the stack must be empty."],
    solution: `export function isValidBrackets(text: string): boolean {
  const required = new Map<string, string>([[")", "("], ["]", "["], ["}", "{"]]);
  const stack: string[] = [];

  for (const char of text) {
    if (!required.has(char)) {
      stack.push(char);
      continue;
    }
    if (stack.pop() !== required.get(char)) return false;
  }

  return stack.length === 0;
}`,
    complexity: { time: "O(n)", space: "O(n)" },
    testCases: ['isValidBrackets("()[]{}") -> true', 'isValidBrackets("([{}])") -> true', 'isValidBrackets("(]") -> false'],
    commonMistakes: ["Only counting brackets instead of validating nesting.", "Not checking for leftover opening brackets.", "Treating every non-closer as an opener without validating the input contract."],
    interviewNarration: "Nested matching is a last-in-first-out problem. The stack represents open brackets waiting for a future closer, so a mismatch at pop time proves invalid ordering."
  }),
  queue: problem({
    id: "enriched-queue-rotting-oranges-grid",
    title: "Minutes to spread through a grid",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given a grid with empty cells, fresh items, and active items, compute how many minutes it takes for activity to spread to adjacent fresh items in four directions, or return -1 if some fresh item can never be reached.",
    pattern: "Multi-source BFS queue",
    difficulty: "medium",
    hints: ["All active cells start at minute zero.", "Process the grid in BFS layers.", "Count remaining fresh cells instead of scanning repeatedly."],
    approach: ["Scan the grid once to enqueue all active cells and count fresh cells.", "Run BFS with a head index and timestamp.", "When an adjacent fresh cell is reached, mark it active and decrement the fresh count.", "Track the latest minute used.", "Return the minute count only if no fresh cells remain."],
    solution: `export function minutesToSpread(grid: number[][]): number {
  const queue: Array<[number, number, number]> = [];
  let fresh = 0;
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[r].length; c += 1) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      if (grid[r][c] === 1) fresh += 1;
    }
  }

  let minutes = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let head = 0; head < queue.length; head += 1) {
    const [row, col, minute] = queue[head];
    minutes = Math.max(minutes, minute);
    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[nr].length && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh -= 1;
        queue.push([nr, nc, minute + 1]);
      }
    }
  }

  return fresh === 0 ? minutes : -1;
}`,
    complexity: { time: "O(rows * cols)", space: "O(rows * cols)" },
    testCases: ["minutesToSpread([[2,1,1],[1,1,0],[0,1,1]]) -> 4", "minutesToSpread([[2,1,1],[0,1,1],[1,0,1]]) -> -1", "minutesToSpread([[0,2]]) -> 0"],
    commonMistakes: ["Starting BFS from only one source.", "Incrementing minutes per cell instead of per layer or timestamp.", "Forgetting to handle no fresh cells."],
    interviewNarration: "This is BFS with many starting points. Enqueuing all active cells at minute zero lets the queue simulate simultaneous spread without special casing each source."
  }),
  twoPointers: problem({
    id: "enriched-two-pointers-container-water",
    title: "Max water between two walls",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given heights of vertical walls on a line, choose two walls that hold the maximum rectangular area of water between them.",
    pattern: "Two pointers converging from both ends",
    difficulty: "medium",
    hints: ["Area is width times the shorter wall.", "The widest pair is checked first.", "Move the pointer at the shorter wall because it is the limiting factor."],
    approach: ["Start pointers at both ends.", "Compute area from current width and smaller height.", "Record the best area.", "Move the pointer with the smaller height inward.", "Stop when the pointers meet."],
    solution: `export function maxWaterArea(heights: number[]): number {
  let left = 0;
  let right = heights.length - 1;
  let best = 0;

  while (left < right) {
    const width = right - left;
    best = Math.max(best, width * Math.min(heights[left], heights[right]));
    if (heights[left] <= heights[right]) left += 1;
    else right -= 1;
  }

  return best;
}`,
    complexity: { time: "O(n)", space: "O(1)" },
    testCases: ["maxWaterArea([1,8,6,2,5,4,8,3,7]) -> 49", "maxWaterArea([1,1]) -> 1", "maxWaterArea([4,3,2,1,4]) -> 16"],
    commonMistakes: ["Moving the taller wall and discarding possible improvements.", "Using absolute height difference instead of minimum height.", "Stopping before evaluating the final adjacent pair."],
    interviewNarration: "The shorter wall caps the area. Moving the taller wall only shrinks width while keeping the same cap, so I advance the shorter side to search for a better limiting height."
  }),
  slidingWindow: problem({
    id: "enriched-sliding-window-longest-unique-substring",
    title: "Longest substring without repeated characters",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given a string, return the length of the longest contiguous substring that contains no repeated characters.",
    pattern: "Sliding window with last-seen indexes",
    difficulty: "medium",
    hints: ["Maintain a valid window.", "When a duplicate appears inside the window, move the left boundary.", "Last-seen indexes let you jump instead of shrinking one step at a time."],
    approach: ["Track the left boundary of the current valid window.", "Store the last index where each character appeared.", "For each right index, move left after the previous occurrence if needed.", "Update the character's last seen index.", "Record the maximum window length."],
    solution: `export function longestUniqueSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const char = s[right];
    if ((lastSeen.get(char) ?? -1) >= left) left = lastSeen.get(char)! + 1;
    lastSeen.set(char, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}`,
    complexity: { time: "O(n)", space: "O(min(n, alphabet))" },
    testCases: ['longestUniqueSubstring("abcabcbb") -> 3', 'longestUniqueSubstring("bbbbb") -> 1', 'longestUniqueSubstring("") -> 0'],
    commonMistakes: ["Moving left backward when a duplicate occurred before the current window.", "Clearing the whole set on a duplicate.", "Returning the substring instead of the length."],
    interviewNarration: "The invariant is that the window from left to right has unique characters. A duplicate only matters if its previous index is still inside that window."
  }),
  prefixSum: problem({
    id: "enriched-prefix-sum-subarray-sum-k",
    title: "Count subarrays with target sum",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given an integer array that may include negative values and a target sum, count how many contiguous subarrays add exactly to the target.",
    pattern: "Prefix sum frequency map",
    difficulty: "medium",
    hints: ["A subarray sum is the difference between two prefix sums.", "For current prefix p, look for previous prefix p - target.", "Negative values make sliding window unreliable."],
    approach: ["Initialize a map with prefix sum zero seen once.", "Scan the array while maintaining the running prefix sum.", "Add the count of prior prefixes equal to current minus target.", "Record the current prefix sum frequency.", "Return the accumulated count."],
    solution: `export function countSubarraysWithSum(nums: number[], target: number): number {
  const seen = new Map<number, number>([[0, 1]]);
  let prefix = 0;
  let count = 0;

  for (const num of nums) {
    prefix += num;
    count += seen.get(prefix - target) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }

  return count;
}`,
    complexity: { time: "O(n)", space: "O(n)" },
    testCases: ["countSubarraysWithSum([1,1,1], 2) -> 2", "countSubarraysWithSum([1,-1,0], 0) -> 3", "countSubarraysWithSum([3,4,7,2,-3,1,4,2], 7) -> 4"],
    commonMistakes: ["Using a sliding window when negatives are allowed.", "Forgetting the initial zero prefix.", "Updating the map before counting and accidentally allowing empty subarrays."],
    interviewNarration: "Every target subarray ending here corresponds to an earlier prefix sum. Counting prior prefixes lets me include negative numbers and duplicate sums in one pass."
  }),
  sorting: problem({
    id: "enriched-sorting-k-closest-points",
    title: "K closest points to origin by squared distance",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given points on a 2D plane and an integer k, return any k points with the smallest distance from the origin.",
    pattern: "Sorting by computed key",
    difficulty: "medium",
    hints: ["Squared distance preserves ordering and avoids square roots.", "The return order is not important.", "Copy before sorting if callers expect input order preserved."],
    approach: ["Define a helper for squared distance.", "Copy the points so sorting does not mutate input unexpectedly.", "Sort by squared distance ascending.", "Return the first k points.", "Mention heap or quickselect alternatives if k is much smaller than n."],
    solution: `export function kClosestPoints(points: number[][], k: number): number[][] {
  const distance = ([x, y]: number[]) => x * x + y * y;
  return [...points].sort((a, b) => distance(a) - distance(b)).slice(0, k);
}`,
    complexity: { time: "O(n log n)", space: "O(n)" },
    testCases: ["kClosestPoints([[1,3],[-2,2]], 1) -> [[-2,2]]", "kClosestPoints([[3,3],[5,-1],[-2,4]], 2) -> any two closest", "kClosestPoints([[0,0]], 1) -> [[0,0]]"],
    commonMistakes: ["Using Math.sqrt unnecessarily.", "Relying on a specific order among equal-distance points.", "Forgetting JavaScript sort mutates the array."],
    interviewNarration: "Sorting is the simplest correct version: compare squared distances and take the prefix. I would volunteer heap or quickselect only after establishing constraints."
  }),
  linkedList: problem({
    id: "enriched-linked-list-reverse",
    title: "Reverse a singly linked list",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given the head of a singly linked list, reverse the list in place and return the new head.",
    pattern: "Pointer rewiring",
    difficulty: "easy",
    hints: ["Keep the previous node.", "Save next before changing current.next.", "The old tail becomes the new tail pointing to null."],
    approach: ["Initialize previous as null and current as head.", "Save current.next before rewiring.", "Point current.next to previous.", "Advance previous and current one step.", "Return previous when current becomes null."],
    solution: `type ListNode = { value: number; next: ListNode | null };

export function reverseList(head: ListNode | null): ListNode | null {
  let previous: ListNode | null = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }

  return previous;
}`,
    complexity: { time: "O(n)", space: "O(1)" },
    testCases: ["1->2->3 -> 3->2->1", "null -> null", "7 -> 7"],
    commonMistakes: ["Losing the rest of the list by rewiring before saving next.", "Returning the original head.", "Creating new nodes when in-place reversal was requested."],
    interviewNarration: "I maintain two pieces of state: the reversed prefix and the unreversed suffix. Each loop moves one node from the suffix to the front of the reversed prefix."
  }),
  treeDfs: problem({
    id: "enriched-tree-dfs-balanced-height",
    title: "Check whether a binary tree is height balanced",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given a binary tree, return whether every node has left and right subtree heights that differ by no more than one.",
    pattern: "Postorder DFS with sentinel failure",
    difficulty: "easy",
    hints: ["A node is balanced only if both children are balanced.", "Height is needed after visiting children.", "Return a sentinel to stop repeated work."],
    approach: ["Write a helper that returns subtree height or -1 if unbalanced.", "For null nodes return height zero.", "Recursively compute left and right heights.", "If either side failed or heights differ too much, return -1.", "The tree is balanced when the root helper does not return -1."],
    solution: `type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

export function isBalancedTree(root: TreeNode | null): boolean {
  function height(node: TreeNode | null): number {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
    return Math.max(left, right) + 1;
  }

  return height(root) !== -1;
}`,
    complexity: { time: "O(n)", space: "O(h)" },
    testCases: ["balanced three-node tree -> true", "linked-list-shaped tree of length 3 -> false", "null -> true"],
    commonMistakes: ["Recomputing height for every node and becoming O(n^2).", "Checking only the root balance.", "Forgetting that an empty tree is balanced."],
    interviewNarration: "This is postorder because the parent needs child heights. Returning -1 for failure carries both height and validity upward in one traversal."
  }),
  treeBfs: problem({
    id: "enriched-tree-bfs-level-averages",
    title: "Average value at each tree level",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given a binary tree, return an array where each value is the average of all node values at that depth from the root.",
    pattern: "Level-order traversal",
    difficulty: "easy",
    hints: ["BFS naturally groups nodes by distance from root.", "Capture queue length before processing a level.", "Use a head index instead of repeated shift for large queues."],
    approach: ["Return an empty array for an empty root.", "Push the root into a queue.", "For each level, snapshot the current queue tail.", "Sum all nodes in that level while enqueueing children.", "Append sum divided by level size."],
    solution: `type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

export function levelAverages(root: TreeNode | null): number[] {
  if (!root) return [];
  const queue: TreeNode[] = [root];
  const result: number[] = [];
  let head = 0;

  while (head < queue.length) {
    const levelEnd = queue.length;
    let sum = 0;
    const size = levelEnd - head;
    while (head < levelEnd) {
      const node = queue[head];
      head += 1;
      sum += node.value;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(sum / size);
  }

  return result;
}`,
    complexity: { time: "O(n)", space: "O(w)" },
    testCases: ["[3,9,20,null,null,15,7] -> [3,14.5,11]", "null -> []", "single node 5 -> [5]"],
    commonMistakes: ["Letting newly enqueued children join the current level.", "Dividing by total node count instead of level size.", "Using Array.shift repeatedly without noting cost."],
    interviewNarration: "I snapshot the queue boundary before each level. That boundary separates nodes already known to be at this depth from children that belong to the next depth."
  }),
  heap: problem({
    id: "enriched-heap-merge-k-sorted-lists",
    title: "Merge K sorted linked lists",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given several sorted singly linked lists, merge them into one sorted list and return its head.",
    pattern: "Min-heap frontier",
    difficulty: "hard",
    hints: ["Only the current head of each list can be the next smallest candidate.", "A min-heap avoids scanning all k heads each time.", "After taking a node, push its next node."],
    approach: ["Implement a small binary min-heap ordered by node value.", "Push each non-null list head.", "Repeatedly pop the smallest node and append it to the result.", "If that node has a next pointer, push the next node.", "Detach the final tail to avoid accidental cycles."],
    solution: `type ListNode = { value: number; next: ListNode | null };

export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap: ListNode[] = [];
  const push = (node: ListNode) => {
    heap.push(node);
    for (let i = heap.length - 1; i > 0;) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent].value <= heap[i].value) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const pop = () => {
    if (heap.length === 1) return heap.pop()!;
    const top = heap[0];
    heap[0] = heap.pop()!;
    for (let i = 0;;) {
      let smallest = i;
      const left = i * 2 + 1;
      const right = left + 1;
      if (left < heap.length && heap[left].value < heap[smallest].value) smallest = left;
      if (right < heap.length && heap[right].value < heap[smallest].value) smallest = right;
      if (smallest === i) break;
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }
    return top;
  };

  for (const list of lists) if (list) push(list);
  const dummy: ListNode = { value: 0, next: null };
  let tail = dummy;
  while (heap.length > 0) {
    const node = pop();
    if (node.next) push(node.next);
    tail.next = node;
    tail = node;
  }
  tail.next = null;
  return dummy.next;
}`,
    complexity: { time: "O(n log k)", space: "O(k)" },
    testCases: ["[[1,4,5],[1,3,4],[2,6]] -> [1,1,2,3,4,4,5,6]", "[] -> null", "[null, 0->2] -> 0->2"],
    commonMistakes: ["Scanning all list heads every time and getting O(nk).", "Forgetting to push the popped node's next pointer.", "Leaving tail.next attached to an old node chain incorrectly."],
    interviewNarration: "At any moment the next output node must be one of the k current heads. A min-heap keeps that frontier ordered while only storing one candidate per list."
  }),
  trie: problem({
    id: "enriched-trie-prefix-lookup",
    title: "Word dictionary with prefix search",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Design a dictionary that supports inserting lowercase words, checking whether a full word exists, and checking whether any stored word starts with a given prefix.",
    pattern: "Trie prefix tree",
    difficulty: "medium",
    hints: ["Each edge represents one character.", "Mark word endings separately from path existence.", "Prefix search succeeds once the prefix path exists."],
    approach: ["Represent each node with a children map and an isWord flag.", "Insert by creating missing child nodes per character.", "For search and startsWith, walk the characters from the root.", "Full search also checks the final node's isWord flag.", "Prefix search only needs the path to exist."],
    solution: `type TrieNode = { children: Map<string, TrieNode>; isWord: boolean };

export class WordDictionary {
  private root: TrieNode = { children: new Map(), isWord: false };

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) node.children.set(char, { children: new Map(), isWord: false });
      node = node.children.get(char)!;
    }
    node.isWord = true;
  }

  search(word: string): boolean {
    const node = this.findNode(word);
    return Boolean(node?.isWord);
  }

  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  private findNode(text: string): TrieNode | null {
    let node = this.root;
    for (const char of text) {
      const next = node.children.get(char);
      if (!next) return null;
      node = next;
    }
    return node;
  }
}

export function createWordDictionary(): WordDictionary {
  return new WordDictionary();
}`,
    complexity: { time: "O(length)", space: "O(total inserted characters)" },
    testCases: ['insert("apple"); search("apple") -> true', 'search("app") before insert app -> false', 'startsWith("app") -> true'],
    commonMistakes: ["Treating every prefix as a complete word.", "Using one global children map instead of per-node children.", "Forgetting empty-prefix behavior if the API requires it."],
    interviewNarration: "A trie shares common prefixes across words. The important distinction is that path existence answers prefix queries, while exact word search needs an end marker."
  }),
  graphDfs: problem({
    id: "enriched-graph-dfs-count-islands",
    title: "Count connected land regions",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given a grid of water and land cells, count how many separate land regions exist when land connects horizontally or vertically.",
    pattern: "Graph DFS flood fill",
    difficulty: "medium",
    hints: ["A grid is an implicit graph.", "Starting DFS from unseen land consumes one whole island.", "Mark visited by mutating or using a set."],
    approach: ["Scan every cell.", "When unseen land is found, increment island count.", "Run DFS from that cell to mark all connected land.", "DFS stops at boundaries, water, or visited cells.", "Return the number of DFS launches."],
    solution: `export function countIslands(grid: string[][]): number {
  let islands = 0;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  function sink(row: number, col: number): void {
    if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] !== "1") return;
    grid[row][col] = "0";
    sink(row + 1, col);
    sink(row - 1, col);
    sink(row, col + 1);
    sink(row, col - 1);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === "1") {
        islands += 1;
        sink(r, c);
  }
}
  }

  return islands;
}`,
    complexity: { time: "O(rows * cols)", space: "O(rows * cols)" },
    testCases: ['[["1","1","0"],["0","1","0"],["1","0","1"]] -> 3', '[["0","0"]] -> 0', '[["1"]] -> 1'],
    commonMistakes: ["Counting every land cell instead of every component.", "Using diagonal adjacency when the prompt says four directions.", "Not marking visited before recursive calls."],
    interviewNarration: "Each DFS launch corresponds to discovering a new component. By sinking all reachable land immediately, the outer scan never double counts the same island."
  }),
  topologicalSort: problem({
    id: "enriched-topological-sort-course-order",
    title: "Course order with prerequisites",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given course labels and prerequisite pairs, return an order to take all courses so every prerequisite appears before the dependent course, or return an empty array if impossible.",
    pattern: "Kahn's topological sort",
    difficulty: "medium",
    hints: ["Prerequisites point toward dependent courses.", "Courses with indegree zero are ready.", "A cycle leaves some nodes unprocessed."],
    approach: ["Build an adjacency list and indegree map.", "Queue every course with indegree zero.", "Pop ready courses into the order.", "Decrease indegree for dependent courses and enqueue newly ready ones.", "If the order misses courses, return an empty array."],
    solution: `export function courseOrder(courses: string[], prerequisites: Array<[string, string]>): string[] {
  const graph = new Map(courses.map((course) => [course, [] as string[]]));
  const indegree = new Map(courses.map((course) => [course, 0]));
  for (const [course, prereq] of prerequisites) {
    graph.get(prereq)!.push(course);
    indegree.set(course, (indegree.get(course) ?? 0) + 1);
  }

  const queue = courses.filter((course) => indegree.get(course) === 0);
  const order: string[] = [];
  for (let head = 0; head < queue.length; head += 1) {
    const course = queue[head];
    order.push(course);
    for (const next of graph.get(course) ?? []) {
      indegree.set(next, indegree.get(next)! - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }

  return order.length === courses.length ? order : [];
}`,
    complexity: { time: "O(vertices + edges)", space: "O(vertices + edges)" },
    testCases: ['courseOrder(["A","B"], [["B","A"]]) -> ["A","B"]', 'cycle A<-B<-A -> []', 'no prerequisites -> any course order'],
    commonMistakes: ["Reversing edge direction.", "Returning partial order when a cycle exists.", "Ignoring isolated courses."],
    interviewNarration: "I model readiness with indegree. Every time a prerequisite is completed, its dependents get closer to zero; failure to process every node means a cycle blocked progress."
  }),
  dijkstra: problem({
    id: "enriched-dijkstra-network-delay",
    title: "Shortest signal delay from one node",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given directed weighted edges with non-negative travel times, return how long it takes a signal from one start node to reach every node, or -1 if any node is unreachable.",
    pattern: "Dijkstra shortest path",
    difficulty: "medium",
    hints: ["BFS is not enough when edge weights differ.", "Always expand the smallest known distance next.", "Skip stale heap entries."],
    approach: ["Build an adjacency list from each source node to weighted neighbors.", "Use a min-priority queue of distance and node.", "When popping a stale distance, skip it.", "Relax outgoing edges with shorter candidate distances.", "Return the maximum final distance if all nodes were reached."],
    solution: `export function networkDelay(nodeCount: number, edges: Array<[number, number, number]>, start: number): number {
  const graph = new Map<number, Array<[number, number]>>();
  for (let node = 1; node <= nodeCount; node += 1) graph.set(node, []);
  for (const [from, to, weight] of edges) graph.get(from)!.push([to, weight]);

  const dist = new Map<number, number>([[start, 0]]);
  const heap: Array<[number, number]> = [[0, start]];
  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]);
    const [cost, node] = heap.shift()!;
    if (cost !== dist.get(node)) continue;
    for (const [next, weight] of graph.get(node) ?? []) {
      const candidate = cost + weight;
      if (candidate < (dist.get(next) ?? Number.POSITIVE_INFINITY)) {
        dist.set(next, candidate);
        heap.push([candidate, next]);
      }
    }
  }

  if (dist.size !== nodeCount) return -1;
  return Math.max(...dist.values());
}`,
    complexity: { time: "O((vertices + edges) log edges) with a real heap; O(edges^2 log edges) with repeated array sort shown for brevity", space: "O(vertices + edges)" },
    testCases: ["networkDelay(4, [[2,1,1],[2,3,1],[3,4,1]], 2) -> 2", "networkDelay(2, [[1,2,1]], 1) -> 1", "networkDelay(2, [[1,2,1]], 2) -> -1"],
    commonMistakes: ["Using Dijkstra with negative weights.", "Returning distance to only one target when the prompt asks all nodes.", "Forgetting stale-entry checks after pushing improved distances."],
    interviewNarration: "Unequal non-negative weights call for Dijkstra. I repeatedly commit the cheapest frontier node, relax its outgoing edges, and then take the slowest committed distance as total delay."
  }),
  unionFind: problem({
    id: "enriched-union-find-redundant-connection",
    title: "Find the edge that creates a cycle",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given undirected edges that are added one by one, return the first edge whose addition connects two vertices that are already in the same component.",
    pattern: "Disjoint set union",
    difficulty: "medium",
    hints: ["Cycle detection in an undirected graph can be a connectivity check.", "If two endpoints already share a representative, the new edge is redundant.", "Path compression keeps repeated finds fast."],
    approach: ["Initialize every vertex as its own parent.", "Implement find with path compression.", "For each edge, compare representatives.", "If representatives match, return that edge.", "Otherwise union the two components."],
    solution: `export function redundantConnection(edges: Array<[number, number]>): [number, number] | null {
  const parent = new Map<number, number>();
  const find = (node: number): number => {
    if (!parent.has(node)) parent.set(node, node);
    if (parent.get(node) !== node) parent.set(node, find(parent.get(node)!));
    return parent.get(node)!;
  };

  for (const [a, b] of edges) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return [a, b];
    parent.set(rootA, rootB);
  }

  return null;
}`,
    complexity: { time: "O(edges * alpha(vertices))", space: "O(vertices)" },
    testCases: ["redundantConnection([[1,2],[1,3],[2,3]]) -> [2,3]", "redundantConnection([[1,2],[2,3]]) -> null", "redundantConnection([[1,2],[2,3],[3,1]]) -> [3,1]"],
    commonMistakes: ["Using Union Find for directed-cycle semantics.", "Unioning before checking whether roots already match.", "Forgetting to initialize unseen vertices."],
    interviewNarration: "For undirected incremental edges, a cycle appears exactly when an edge joins two nodes already connected. Union Find answers that connectivity question efficiently."
  }),
  backtracking: problem({
    id: "enriched-backtracking-combination-sum",
    title: "Combinations that add to a target",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given positive candidate numbers and a target, return all unique combinations where chosen numbers sum to the target. A candidate may be reused.",
    pattern: "Backtracking with start index",
    difficulty: "medium",
    hints: ["Use a start index to avoid permuting the same combination.", "Reusing a number means the recursive call keeps the same index.", "Stop when the remaining target becomes negative or zero."],
    approach: ["Sort candidates to make pruning easier.", "DFS with start index, remaining target, and current path.", "When remaining is zero, copy the path into results.", "For each candidate from start onward, choose it and recurse with the same index.", "Undo the choice before trying the next candidate."],
    solution: `export function combinationSum(candidates: number[], target: number): number[][] {
  const nums = [...candidates].sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];

  function dfs(start: number, remaining: number): void {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < nums.length && nums[i] <= remaining; i += 1) {
      path.push(nums[i]);
      dfs(i, remaining - nums[i]);
      path.pop();
    }
  }

  dfs(0, target);
  return result;
}`,
    complexity: { time: "O(branches^depth)", space: "O(target / minCandidate)" },
    testCases: ["combinationSum([2,3,6,7], 7) -> [[2,2,3],[7]]", "combinationSum([2], 1) -> []", "combinationSum([1], 2) -> [[1,1]]"],
    commonMistakes: ["Advancing the index when reuse is allowed.", "Pushing the mutable path without copying.", "Generating permutations like [2,3,2] and [2,2,3]."],
    interviewNarration: "The start index controls uniqueness, while keeping the same index models reuse. Each recursive frame owns one choice and undoes it before exploring the next branch."
  }),
  greedy: problem({
    id: "enriched-greedy-jump-game",
    title: "Decide if the last index is reachable",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given an array where each value is the maximum jump length from that index, determine whether it is possible to reach the final index from the first index.",
    pattern: "Greedy farthest reach",
    difficulty: "medium",
    hints: ["Track the farthest reachable index so far.", "If the current index is beyond that reach, progress is impossible.", "You do not need to enumerate every jump path."],
    approach: ["Initialize farthest reachable index to zero.", "Scan indexes from left to right.", "If an index exceeds farthest, return false.", "Update farthest with index plus jump length.", "Return true once farthest reaches the last index or the scan completes."],
    solution: `export function canReachEnd(jumps: number[]): boolean {
  let farthest = 0;
  for (let i = 0; i < jumps.length; i += 1) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + jumps[i]);
    if (farthest >= jumps.length - 1) return true;
  }
  return true;
}`,
    complexity: { time: "O(n)", space: "O(1)" },
    testCases: ["canReachEnd([2,3,1,1,4]) -> true", "canReachEnd([3,2,1,0,4]) -> false", "canReachEnd([0]) -> true"],
    commonMistakes: ["Trying all paths with exponential recursion.", "Treating jump value as mandatory instead of maximum.", "Failing single-element arrays."],
    interviewNarration: "I only need the best frontier, not the exact path. If every index up to farthest is reachable, each of those indexes can extend the frontier greedily."
  }),
  intervals: problem({
    id: "enriched-intervals-merge-overlaps",
    title: "Merge overlapping intervals",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given intervals with start and end values, return a list of intervals where all overlapping ranges have been merged.",
    pattern: "Sort by start then sweep",
    difficulty: "medium",
    hints: ["Overlaps are easier after sorting by start.", "Compare the next start with the current merged end.", "Extend the end when intervals overlap."],
    approach: ["Copy and sort intervals by start.", "Initialize an empty merged list.", "For each interval, compare it with the last merged interval.", "If it overlaps, extend the last end.", "Otherwise append it as a new disjoint interval."],
    solution: `export function mergeIntervals(intervals: Array<[number, number]>): Array<[number, number]> {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];

  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (!last || start > last[1]) merged.push([start, end]);
    else last[1] = Math.max(last[1], end);
  }

  return merged;
}`,
    complexity: { time: "O(n log n)", space: "O(n)" },
    testCases: ["mergeIntervals([[1,3],[2,6],[8,10],[15,18]]) -> [[1,6],[8,10],[15,18]]", "mergeIntervals([[1,4],[4,5]]) -> [[1,5]]", "mergeIntervals([]) -> []"],
    commonMistakes: ["Forgetting to sort first.", "Using start >= end when touching intervals should merge.", "Mutating input intervals without intending to."],
    interviewNarration: "Sorting makes the active merged interval the only interval I need to compare against. Once a later start is beyond its end, no future interval can merge backward."
  }),
  bitManipulation: problem({
    id: "enriched-bit-manipulation-single-number",
    title: "Find the value that appears once",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    originalStatement: "Given an array where every value appears exactly twice except for one value that appears once, return the single value.",
    pattern: "XOR cancellation",
    difficulty: "easy",
    hints: ["x XOR x becomes zero.", "x XOR zero stays x.", "XOR order does not matter."],
    approach: ["Initialize result to zero.", "XOR every number into result.", "Paired values cancel each other out.", "The unpaired value remains.", "Return the result."],
    solution: `export function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) result ^= num;
  return result;
}`,
    complexity: { time: "O(n)", space: "O(1)" },
    testCases: ["singleNumber([2,2,1]) -> 1", "singleNumber([4,1,2,1,2]) -> 4", "singleNumber([-1,0,-1]) -> 0"],
    commonMistakes: ["Using a set and missing the constant-space opportunity.", "Applying this trick when counts are not exactly pairs plus one.", "Forgetting JavaScript bitwise operators operate on 32-bit signed integers."],
    interviewNarration: "XOR gives a compact cancellation proof. Because pairs vanish and XOR is commutative, the scan order does not matter and the remaining bits are the unique value."
  }),
  matrix: problem({
    id: "enriched-matrix-spiral-order",
    title: "Read a matrix in spiral order",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    originalStatement: "Given a rectangular matrix, return all values in clockwise spiral order starting from the top-left cell.",
    pattern: "Matrix boundary simulation",
    difficulty: "medium",
    hints: ["Track top, bottom, left, and right boundaries.", "After traversing a side, move that boundary inward.", "Check boundaries before bottom and left traversals."],
    approach: ["Initialize four boundaries around the matrix.", "Traverse the top row left to right and increment top.", "Traverse the right column top to bottom and decrement right.", "If rows remain, traverse the bottom row right to left.", "If columns remain, traverse the left column bottom to top."],
    solution: `export function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  if (matrix.length === 0 || matrix[0].length === 0) return result;
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col += 1) result.push(matrix[top][col]);
    top += 1;
    for (let row = top; row <= bottom; row += 1) result.push(matrix[row][right]);
    right -= 1;
    if (top <= bottom) {
      for (let col = right; col >= left; col -= 1) result.push(matrix[bottom][col]);
      bottom -= 1;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row -= 1) result.push(matrix[row][left]);
      left += 1;
    }
  }

  return result;
}`,
    complexity: { time: "O(rows * cols)", space: "O(1) extra excluding output" },
    testCases: ["spiralOrder([[1,2,3],[4,5,6],[7,8,9]]) -> [1,2,3,6,9,8,7,4,5]", "spiralOrder([[1,2,3,4]]) -> [1,2,3,4]", "spiralOrder([]) -> []"],
    commonMistakes: ["Duplicating the middle row or column.", "Assuming a square matrix.", "Failing empty matrix input."],
    interviewNarration: "This is not graph traversal; it is careful boundary accounting. Each completed side moves one boundary inward, and guard checks prevent revisiting cells in thin matrices."
  })
};

export const enrichedDsaContent = [
  {
    topicSlug: "arrays-strings",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Arrays and strings are contiguous sequences, so most interview solutions come from scanning, indexing, and maintaining compact state.",
    deepExplanation: "The high-frequency skill is turning positional constraints into one or two passes while being precise about mutation, boundaries, and whether the output counts as auxiliary space.",
    whyInterviewersAsk: "Arrays and strings are the default medium for testing loop discipline, edge cases, and whether you can improve brute force without overengineering.",
    prerequisites: ["Loop invariants", "Indexing", "JavaScript arrays and strings"],
    skipForNow: ["Suffix arrays", "Advanced string matching"],
    roleRelevance: ["Coding screens", "Data transformation", "API payload validation"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "very-high",
    lineByLineExplanation: ["Name what each pass knows.", "Avoid accidental mutation unless the prompt permits it.", "Separate output storage from avoidable working storage."],
    enrichedProblems: [phase61DsaProblems.arraysStrings],
    designCapstones: []
  },
  {
    topicSlug: "hashmap-frequency",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Hash maps let you remember facts while scanning once: counts, last seen indexes, complements, and membership.",
    deepExplanation: "The interview skill is choosing the key. A good key turns repeated searching into O(1) average lookup and makes the invariant obvious.",
    whyInterviewersAsk: "Hash maps test whether you can reduce brute force by storing the right state.",
    prerequisites: ["Arrays", "Objects/Map in JavaScript", "Big-O basics"],
    skipForNow: ["Custom hash table internals", "Collision-resolution implementation"],
    roleRelevance: ["Senior engineer coding screen", "Backend debugging with aggregation", "Data processing interviews"],
    estimatedTimeMinutes: 90,
    interviewFrequency: "very-high",
    lineByLineExplanation: ["Create storage before the scan.", "Update state exactly once per element.", "Explain what the map represents at each loop iteration."],
    enrichedProblems: [twoSumFrequency, topKFrequent],
    designCapstones: []
  },
  {
    topicSlug: "stack",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "A stack remembers the most recent unfinished item, which makes it ideal for nesting, undo, monotonic scans, and expression parsing.",
    deepExplanation: "Stack problems are about choosing what unresolved state belongs on the stack and when an incoming item resolves or invalidates the top item.",
    whyInterviewersAsk: "Stacks test whether you recognize last-in-first-out structure hidden inside strings, arrays, and parser-like prompts.",
    prerequisites: ["Arrays", "Push/pop operations", "Basic string iteration"],
    skipForNow: ["Compiler parser generators", "Expression AST construction"],
    roleRelevance: ["Coding interviews", "Validation logic", "Editor and workflow features"],
    estimatedTimeMinutes: 75,
    interviewFrequency: "high",
    lineByLineExplanation: ["Push unresolved openers.", "Resolve only against the top.", "Finish with no unresolved state."],
    enrichedProblems: [phase61DsaProblems.stack],
    designCapstones: []
  },
  {
    topicSlug: "queue",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "A queue processes the oldest pending item first, which models fair ordering and breadth-first expansion.",
    deepExplanation: "In interviews, queues often appear as BFS layers, multi-source spread, stream processing, or moving windows that need predictable removal order.",
    whyInterviewersAsk: "Queues reveal whether you can model time, distance, and level-order processing without mixing current and future work.",
    prerequisites: ["Arrays", "Head index queue implementation", "Grid traversal"],
    skipForNow: ["Lock-free queues", "Distributed queue semantics"],
    roleRelevance: ["Coding interviews", "Job processing", "Event simulation"],
    estimatedTimeMinutes: 90,
    interviewFrequency: "high",
    lineByLineExplanation: ["Seed all initial work.", "Advance with a head index.", "Attach distance or timestamp when the prompt needs time."],
    enrichedProblems: [phase61DsaProblems.queue],
    designCapstones: []
  },
  {
    topicSlug: "two-pointers",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Two pointers coordinate two positions in a sequence so each movement has a reason and the scan stays linear.",
    deepExplanation: "The pattern works when sorted order, opposing boundaries, or a maintained invariant tells you which pointer can move without losing a valid answer.",
    whyInterviewersAsk: "Two pointers test proof of elimination: you must explain why a skipped pair cannot be optimal or necessary.",
    prerequisites: ["Arrays", "Sorted order", "Loop invariants"],
    skipForNow: ["Rotating calipers geometry"],
    roleRelevance: ["Coding screens", "Search-space reduction", "Performance tuning"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "very-high",
    lineByLineExplanation: ["Define the invariant.", "Evaluate before moving.", "Move the pointer that cannot help in its current position."],
    enrichedProblems: [phase61DsaProblems.twoPointers],
    designCapstones: []
  },
  {
    topicSlug: "sliding-window",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Sliding window keeps a contiguous range valid while one boundary expands and the other boundary repairs violations.",
    deepExplanation: "The key decision is whether the window has fixed size, variable size with a monotonic constraint, or needs auxiliary counts/indexes to jump boundaries safely.",
    whyInterviewersAsk: "Sliding window tests whether you can maintain a local invariant instead of recomputing every substring or subarray.",
    prerequisites: ["Arrays and strings", "Hash maps", "Two pointers"],
    skipForNow: ["Deque-based monotonic window maximum"],
    roleRelevance: ["Coding interviews", "Streaming analytics", "Input validation"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "very-high",
    lineByLineExplanation: ["Expand right.", "Repair left only when invalid.", "Record answers while the invariant is true."],
    enrichedProblems: [phase61DsaProblems.slidingWindow],
    designCapstones: []
  },
  {
    topicSlug: "prefix-sum",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Prefix sums store cumulative totals so range sums can be answered by subtraction.",
    deepExplanation: "When values can be negative or many ranges must be counted, prefix sums plus a frequency map often replace fragile sliding-window logic.",
    whyInterviewersAsk: "Prefix sums test whether you can transform repeated range work into remembered cumulative state.",
    prerequisites: ["Arrays", "Hash maps", "Algebraic range differences"],
    skipForNow: ["Fenwick trees", "Segment trees"],
    roleRelevance: ["Coding interviews", "Metrics windows", "Ledger-style aggregation"],
    estimatedTimeMinutes: 90,
    interviewFrequency: "high",
    lineByLineExplanation: ["Initialize the zero prefix.", "Count before recording the current prefix when avoiding empty ranges.", "Use frequency, not only membership, when duplicates matter."],
    enrichedProblems: [phase61DsaProblems.prefixSum],
    designCapstones: []
  },
  {
    topicSlug: "sorting",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Sorting pays O(n log n) up front to create order that makes later comparisons local and predictable.",
    deepExplanation: "In interviews, sorting is often a setup move for two pointers, greedy decisions, interval merging, duplicate handling, and ranking by computed keys.",
    whyInterviewersAsk: "Sorting checks comparator correctness, mutation awareness, and your judgment about trading time for simpler structure.",
    prerequisites: ["Arrays", "Comparator functions", "Big-O"],
    skipForNow: ["Implementing every sorting algorithm from scratch"],
    roleRelevance: ["Coding interviews", "Batch processing", "Ranking and scheduling"],
    estimatedTimeMinutes: 90,
    interviewFrequency: "high",
    lineByLineExplanation: ["Sort by the property the decision needs.", "Remember JS sort mutates.", "State when a faster heap or quickselect alternative matters."],
    enrichedProblems: [phase61DsaProblems.sorting],
    designCapstones: []
  },
  {
    topicSlug: "graph-bfs",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "BFS explores all positions one move away, then two moves away, then three. That layer order gives shortest paths when every edge has equal cost.",
    deepExplanation: "For grids, words, locks, and state machines, your real job is to model valid neighbors and prevent repeated states. The queue is just the mechanical part.",
    whyInterviewersAsk: "BFS exposes graph modeling, queue discipline, shortest-path reasoning, and edge-case handling.",
    prerequisites: ["Queue", "Set", "Grid traversal", "Graph basics"],
    skipForNow: ["Weighted shortest paths", "A* heuristics"],
    roleRelevance: ["Coding interviews", "Workflow/state-machine reasoning", "Distributed graph/search problems"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "high",
    lineByLineExplanation: ["Validate the start state.", "Push state plus distance.", "Mark seen before enqueue.", "Return as soon as the target is popped or discovered."],
    enrichedProblems: [graphBfsShortestPath],
    designCapstones: []
  },
  {
    topicSlug: "linked-list",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Linked lists trade direct indexing for pointer manipulation, so correctness depends on preserving references before rewiring nodes.",
    deepExplanation: "Most linked-list interviews are small pointer state machines: previous, current, next, dummy head, fast/slow, or merge tails.",
    whyInterviewersAsk: "Linked lists reveal whether you can reason about mutable references without leaning on array indexing.",
    prerequisites: ["Objects and references", "While loops", "Null checks"],
    skipForNow: ["Skip lists", "Intrusive linked-list memory layouts"],
    roleRelevance: ["Coding screens", "Pointer reasoning", "Runtime data structures"],
    estimatedTimeMinutes: 90,
    interviewFrequency: "high",
    lineByLineExplanation: ["Save next before mutation.", "Move one pointer role at a time.", "Return the new structural entry point."],
    enrichedProblems: [phase61DsaProblems.linkedList],
    designCapstones: []
  },
  {
    topicSlug: "tree-dfs",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Tree DFS explores down a branch before returning to combine child results at the parent.",
    deepExplanation: "Most tree DFS solutions choose preorder for carrying state downward, inorder for sorted BST order, or postorder when parent answers depend on child answers.",
    whyInterviewersAsk: "Tree DFS tests recursion, base cases, and whether you can combine local and child information cleanly.",
    prerequisites: ["Recursion", "Binary trees", "Call stack"],
    skipForNow: ["Morris traversal", "Persistent trees"],
    roleRelevance: ["Coding interviews", "Hierarchy processing", "Parser-like structures"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "high",
    lineByLineExplanation: ["Handle null first.", "Choose traversal order based on dependency.", "Return enough information for the parent."],
    enrichedProblems: [phase61DsaProblems.treeDfs],
    designCapstones: []
  },
  {
    topicSlug: "tree-bfs",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Tree BFS processes nodes by depth, which makes level statistics and nearest-level answers natural.",
    deepExplanation: "The core move is snapshotting the level boundary so children enqueued during this pass do not leak into the current level.",
    whyInterviewersAsk: "Tree BFS tests queue mechanics, level boundaries, and memory reasoning for wide trees.",
    prerequisites: ["Queues", "Binary trees", "Arrays"],
    skipForNow: ["External-memory tree traversal"],
    roleRelevance: ["Coding interviews", "Org chart processing", "Tree visualization"],
    estimatedTimeMinutes: 90,
    interviewFrequency: "high",
    lineByLineExplanation: ["Queue the root.", "Snapshot level size or end index.", "Append children for the next level only."],
    enrichedProblems: [phase61DsaProblems.treeBfs],
    designCapstones: []
  },
  {
    topicSlug: "heap",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "A heap keeps quick access to the smallest or largest item while allowing new candidates to be added efficiently.",
    deepExplanation: "Interview heap problems usually maintain a frontier of candidates: top k, merge k streams, scheduling by next event, or shortest-path expansion.",
    whyInterviewersAsk: "Heaps test whether you can avoid repeated full scans when only the next best item matters.",
    prerequisites: ["Binary tree array representation", "Comparator thinking", "Priority queue use cases"],
    skipForNow: ["Fibonacci heaps", "Pairing heaps"],
    roleRelevance: ["Coding interviews", "Schedulers", "Streaming ranking"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "high",
    lineByLineExplanation: ["Store only active candidates.", "Pop the best candidate.", "Push newly exposed candidates."],
    enrichedProblems: [phase61DsaProblems.heap],
    designCapstones: []
  },
  {
    topicSlug: "trie",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "A trie stores strings as shared character paths, making prefix queries direct instead of repeated full scans.",
    deepExplanation: "The important modeling choice is per-node children plus explicit terminal markers, because a prefix path and a complete word are different facts.",
    whyInterviewersAsk: "Tries test custom data-structure design and whether you can optimize repeated prefix lookup workloads.",
    prerequisites: ["Maps", "Strings", "Tree-like nodes"],
    skipForNow: ["Compressed radix trees", "Automata"],
    roleRelevance: ["Autocomplete", "Search suggestions", "Coding interviews"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "medium",
    lineByLineExplanation: ["Walk or create one character at a time.", "Store terminal word state separately.", "Reuse the same traversal helper for search and prefix checks."],
    enrichedProblems: [phase61DsaProblems.trie],
    designCapstones: []
  },
  {
    topicSlug: "graph-dfs",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Graph DFS follows paths deeply while marking visited nodes so cycles or repeated neighbors do not cause infinite work.",
    deepExplanation: "The pattern starts with modeling neighbors correctly, then deciding whether visited state can mutate input or must live in an external set.",
    whyInterviewersAsk: "Graph DFS tests component reasoning, recursion control, and careful handling of implicit grid graphs.",
    prerequisites: ["Recursion", "Sets", "Grid or adjacency-list traversal"],
    skipForNow: ["Tarjan SCC", "Bridge-finding algorithms"],
    roleRelevance: ["Coding interviews", "Dependency traversal", "Reachability analysis"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "high",
    lineByLineExplanation: ["Launch only from unseen nodes.", "Mark before recursing.", "Let one traversal consume a full component."],
    enrichedProblems: [phase61DsaProblems.graphDfs],
    designCapstones: []
  },
  {
    topicSlug: "topological-sort",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Topological sort orders directed work so prerequisites come before the tasks that depend on them.",
    deepExplanation: "Kahn's algorithm treats indegree zero nodes as ready work and uses the count of processed nodes as a clean cycle detector.",
    whyInterviewersAsk: "It tests graph modeling, edge direction, cycle detection, and dependency scheduling intuition.",
    prerequisites: ["Directed graphs", "Queues", "Hash maps"],
    skipForNow: ["Dynamic topological ordering"],
    roleRelevance: ["Build systems", "Course planning", "Workflow orchestration"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "high",
    lineByLineExplanation: ["Build edges from prerequisite to dependent.", "Queue ready nodes.", "A missing node in the final order means a cycle."],
    enrichedProblems: [phase61DsaProblems.topologicalSort],
    designCapstones: []
  },
  {
    topicSlug: "dijkstra",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Dijkstra finds cheapest paths when edge costs are non-negative by always expanding the currently cheapest known frontier.",
    deepExplanation: "Correctness depends on the non-negative-weight property: once the cheapest node is popped, no later path can improve it through extra non-negative edges.",
    whyInterviewersAsk: "Dijkstra separates weighted shortest paths from BFS and tests priority-queue reasoning under realistic constraints.",
    prerequisites: ["Graphs", "Priority queues", "Relaxation"],
    skipForNow: ["Negative-weight shortest paths", "A* heuristics"],
    roleRelevance: ["Routing", "Cost optimization", "Coding interviews"],
    estimatedTimeMinutes: 140,
    interviewFrequency: "medium",
    lineByLineExplanation: ["Pop cheapest known state.", "Ignore stale entries.", "Relax outgoing weighted edges."],
    enrichedProblems: [phase61DsaProblems.dijkstra],
    designCapstones: []
  },
  {
    topicSlug: "union-find",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Union Find tracks which items belong to the same component and merges components as relationships arrive.",
    deepExplanation: "Path compression and union by size/rank make repeated connectivity checks nearly constant time for practical interview inputs.",
    whyInterviewersAsk: "Union Find tests whether you can switch from traversal to incremental connectivity when edges arrive as operations.",
    prerequisites: ["Graphs", "Trees as parent pointers", "Recursion or loops"],
    skipForNow: ["Rollback DSU", "Fully dynamic connectivity"],
    roleRelevance: ["Clustering", "Deduplication", "Network connectivity"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "medium",
    lineByLineExplanation: ["Find representatives.", "Detect same-set conflicts before union.", "Compress paths during find."],
    enrichedProblems: [phase61DsaProblems.unionFind],
    designCapstones: []
  },
  {
    topicSlug: "recursion-backtracking",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Backtracking explores a decision tree by choosing an option, recursing, and undoing the choice before trying the next option.",
    deepExplanation: "The repeatable interview framework is state, choices, validity/pruning, base case, copy output, and undo mutation.",
    whyInterviewersAsk: "Backtracking tests systematic search and whether you can control duplicates and mutable state.",
    prerequisites: ["Recursion", "Arrays", "Sets"],
    skipForNow: ["Exact cover", "Constraint propagation engines"],
    roleRelevance: ["Coding interviews", "Combinatorial search", "Rules engines"],
    estimatedTimeMinutes: 140,
    interviewFrequency: "high",
    lineByLineExplanation: ["Choose.", "Recurse with updated state.", "Undo before the next choice."],
    enrichedProblems: [phase61DsaProblems.backtracking],
    designCapstones: []
  },
  {
    topicSlug: "greedy",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Greedy algorithms make the locally best safe choice and rely on an invariant proving that choice cannot hurt the global answer.",
    deepExplanation: "A strong greedy answer explains the exchange argument or frontier invariant; without that, it is often just a hopeful heuristic.",
    whyInterviewersAsk: "Greedy problems test proof instincts and the ability to avoid unnecessary DP or search.",
    prerequisites: ["Arrays", "Invariants", "Basic proof by contradiction"],
    skipForNow: ["Matroid theory"],
    roleRelevance: ["Coding interviews", "Scheduling", "Resource allocation"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "high",
    lineByLineExplanation: ["Define the safe local state.", "Update only the summary needed.", "Explain why omitted paths cannot beat it."],
    enrichedProblems: [phase61DsaProblems.greedy],
    designCapstones: []
  },
  {
    topicSlug: "intervals",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Interval problems reason about ranges that overlap, touch, cover, or compete for limited resources.",
    deepExplanation: "Sorting by start, end, or event time turns pairwise range comparison into a linear sweep with a small active state.",
    whyInterviewersAsk: "Intervals test boundary precision and your ability to turn schedules into ordered events.",
    prerequisites: ["Sorting", "Comparator functions", "Boundary conditions"],
    skipForNow: ["Segment trees", "Interval trees"],
    roleRelevance: ["Calendars", "Bookings", "Resource scheduling"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "high",
    lineByLineExplanation: ["Sort to make overlap local.", "Compare next start with current end.", "Be explicit about touching intervals."],
    enrichedProblems: [phase61DsaProblems.intervals],
    designCapstones: []
  },
  {
    topicSlug: "bit-manipulation",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Bit manipulation treats each binary digit as compact state for flags, parity, masks, and cancellation tricks.",
    deepExplanation: "Interview bit problems are small once you can explain the algebra of XOR, AND masks, shifts, and the constraints that make each trick valid.",
    whyInterviewersAsk: "Bit manipulation checks low-level reasoning and whether you can exploit numeric structure without obscuring correctness.",
    prerequisites: ["Binary numbers", "Boolean logic", "JavaScript bitwise caveats"],
    skipForNow: ["Bitset DP", "SIMD"],
    roleRelevance: ["Permissions", "Flags", "Compact state encoding"],
    estimatedTimeMinutes: 75,
    interviewFrequency: "medium",
    lineByLineExplanation: ["State the operator identity.", "Validate input constraints.", "Call out JavaScript 32-bit signed behavior."],
    enrichedProblems: [phase61DsaProblems.bitManipulation],
    designCapstones: []
  },
  {
    topicSlug: "matrix",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Matrix problems are array problems with two coordinates, so most bugs come from boundary checks and revisiting cells.",
    deepExplanation: "Common approaches include boundary simulation, BFS/DFS over implicit neighbors, row-column preprocessing, and coordinate transforms.",
    whyInterviewersAsk: "Matrices test index discipline, spatial reasoning, and whether you can keep traversal state compact.",
    prerequisites: ["2D arrays", "Loops", "Boundary checks"],
    skipForNow: ["Sparse matrix compression", "Linear algebra algorithms"],
    roleRelevance: ["Coding screens", "Grid search", "Image-like data processing"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "high",
    lineByLineExplanation: ["Name row and column bounds.", "Guard thin matrix cases.", "Ensure each cell is visited at most once."],
    enrichedProblems: [phase61DsaProblems.matrix],
    designCapstones: []
  },
  {
    topicSlug: "binary-search",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "the-algorithms-javascript"],
    beginnerExplanation: "Binary search repeatedly removes half of the remaining answer space.",
    deepExplanation: "The senior version is binary search on a monotonic predicate, where you search for the smallest or largest value that satisfies a feasibility check.",
    whyInterviewersAsk: "It tests boundary discipline, monotonic reasoning, and ability to convert optimization into decision.",
    prerequisites: ["Sorted arrays", "Loop invariants", "Integer boundaries"],
    skipForNow: ["Floating-point epsilon search"],
    roleRelevance: ["Coding screen", "Capacity planning intuition", "Performance-sensitive backend work"],
    estimatedTimeMinutes: 100,
    interviewFrequency: "very-high",
    lineByLineExplanation: ["Choose inclusive bounds.", "Define what left and right mean.", "Move the impossible side away.", "Return the boundary that survives."],
    enrichedProblems: [binarySearchAnswer],
    designCapstones: []
  },
  {
    topicSlug: "dynamic-programming-core",
    sourceRefs: ["neetcode-roadmap", "leetcode-problemset", "tech-interview-handbook"],
    beginnerExplanation: "Dynamic programming stores answers to smaller overlapping subproblems so you do not recompute them.",
    deepExplanation: "Good DP answers name the state, recurrence, base case, traversal order, and final answer location.",
    whyInterviewersAsk: "DP tests abstraction under pressure and whether you can derive a recurrence instead of memorizing patterns.",
    prerequisites: ["Recursion", "Arrays", "Big-O", "Basic combinatorics"],
    skipForNow: ["Digit DP", "Tree DP", "Bitmask DP"],
    roleRelevance: ["Senior coding rounds", "Optimization thinking", "Algorithmic confidence rebuilding"],
    estimatedTimeMinutes: 150,
    interviewFrequency: "high",
    lineByLineExplanation: ["Define dp[x].", "Initialize base cases.", "Iterate in dependency order.", "Return the requested state."],
    enrichedProblems: [dpCoinChange],
    designCapstones: []
  }
] satisfies EnrichedTopicContent[];
