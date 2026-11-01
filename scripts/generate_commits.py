#!/usr/bin/env python3
"""
Semantic Commit Generator
Generates realistic, semantic conventional commits across a specified date range
using standard Git environment variables (GIT_AUTHOR_DATE, GIT_COMMITTER_DATE).
"""

import os
import sys
import random
import subprocess
from datetime import datetime, timedelta

# Categories and realistic semantic messages aligned with AI / Quant / Systems Engineering
SEMANTIC_MESSAGES = [
    # Features
    "feat(quant): implement rolling cointegration spread calculator",
    "feat(quant): integrate fractional Kelly criterion risk sizer",
    "feat(quant): add regime-switching volatility cluster detector",
    "feat(quant): implement Page-Hinkley cumulative sum drift monitor",
    "feat(crdt): implement vector clock increment and partial ordering",
    "feat(crdt): add state-based CvRDT merge resolution lattice",
    "feat(crdt): support local-first optimistic mutation buffer",
    "feat(agent): add supervisor routing node for parallel sub-agents",
    "feat(agent): implement hybrid dense-sparse retrieval pipeline",
    "feat(agent): add self-reflection retry loop on tool invocation",
    "feat(api): add Redis pub/sub floorsheet telemetry streamer",
    "feat(api): implement Upstash rate limiter middleware",
    "feat(ui): add aurora glassmorphic visual components",
    "feat(ui): implement keyboard navigation shortcuts in CLI mode",
    "feat(ui): add real-time vector clock state visualizer",

    # Performance
    "perf(crdt): reduce vector clock serialization overhead by 40%",
    "perf(quant): vectorize tick data normalization with NumPy",
    "perf(api): batch Redis pipelined lookups for sub-millisecond retrieval",
    "perf(agent): optimize token budget with dynamic context windowing",
    "perf(ui): eliminate layout shifts by locking image aspect ratios",
    "perf(build): migrate Google Fonts to next/font for zero render-blocking",
    "perf(db): add compound index for time-series floorsheet queries",

    # Fixes
    "fix(quant): resolve floating point drift in Kelly sizing calculations",
    "fix(quant): handle missing tick intervals during market halt phases",
    "fix(crdt): prevent concurrent tie-break regression on duplicate timestamps",
    "fix(agent): handle upstream rate limits with exponential backoff",
    "fix(api): ensure connection pool recovers after transient network drop",
    "fix(ui): correct mobile viewport overflow in terminal simulator",
    "fix(security): sanitize inquiry inputs against XSS injections",

    # Refactoring
    "refactor(quant): extract statistical indicators into modular functions",
    "refactor(crdt): decouple vector clock logic from WebSocket transport",
    "refactor(agent): standardize prompt templates and output schemas",
    "refactor(api): convert contact endpoint to typed Zod schema validator",
    "refactor(ui): extract theme definitions into dedicated design token map",
    "refactor(core): streamline error handling across async dispatchers",

    # Docs & Tests
    "docs(arch): update distributed state machine diagrams",
    "docs(quant): document regime classification mathematical proofs",
    "docs(crdt): add vector clock causality walkthrough and references",
    "docs(readme): add local setup and environment configuration guide",
    "test(quant): add unit tests for concept drift boundary conditions",
    "test(crdt): verify eventual consistency across 3 simulated nodes",
    "test(api): add integration tests for contact inquiry route",
    "test(agent): mock LLM tool-calling responses for regression suite"
]

def generate_commits(total_commits=1000, start_date_str="2026-09-01", end_date_str="2026-10-31"):
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    total_days = (end_date - start_date).days + 1

    if total_days <= 0:
        print("Error: Start date must be before end date.")
        sys.exit(1)

    print(f"Generating {total_commits} semantic commits across {total_days} days ({start_date_str} to {end_date_str})...")

    # Distribute commits with realistic daily variance (more on weekdays, fewer on weekends)
    day_weights = []
    current = start_date
    while current <= end_date:
        # Weekdays (Mon-Fri: 0-4) get higher probability, weekends get lower
        weekday = current.weekday()
        if weekday < 5:
            weight = random.uniform(1.2, 2.5)
        else:
            weight = random.uniform(0.3, 1.0)
        day_weights.append((current, weight))
        current += timedelta(days=1)

    total_weight = sum(w for _, w in day_weights)
    commits_per_day = {}
    remaining_commits = total_commits

    for day, weight in day_weights:
        count = int((weight / total_weight) * total_commits)
        commits_per_day[day] = count
        remaining_commits -= count

    # Distribute any remaining commits due to rounding
    days_list = list(commits_per_day.keys())
    while remaining_commits > 0:
        chosen_day = random.choice(days_list)
        commits_per_day[chosen_day] += 1
        remaining_commits -= 1

    commit_count = 0
    for day, count in commits_per_day.items():
        # Generate distributed timestamps throughout the day (between 09:30 and 22:30)
        timestamps = []
        for _ in range(count):
            hour = random.randint(9, 22)
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            dt = day.replace(hour=hour, minute=minute, second=second)
            timestamps.append(dt)

        timestamps.sort()

        for ts in timestamps:
            date_iso = ts.strftime("%Y-%m-%d %H:%M:%S +0545")
            msg = random.choice(SEMANTIC_MESSAGES)

            env = os.environ.copy()
            env["GIT_AUTHOR_NAME"] = "Prabesh1919"
            env["GIT_AUTHOR_EMAIL"] = "prabesh.shah.dev@gmail.com"
            env["GIT_COMMITTER_NAME"] = "Prabesh1919"
            env["GIT_COMMITTER_EMAIL"] = "prabesh.shah.dev@gmail.com"
            env["GIT_AUTHOR_DATE"] = date_iso
            env["GIT_COMMITTER_DATE"] = date_iso

            cmd = ["git", "commit", "--allow-empty", "-m", msg]
            res = subprocess.run(cmd, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

            if res.returncode != 0:
                print(f"Error creating commit: {res.stderr.decode()}")
                sys.exit(1)

            commit_count += 1
            if commit_count % 100 == 0 or commit_count == total_commits:
                print(f"Progress: {commit_count}/{total_commits} commits generated...")

    print(f"\nDone! Successfully created {commit_count} semantic commits.")

if __name__ == "__main__":
    count = 1000
    start = "2026-09-01"
    end = "2026-10-31"
    if len(sys.argv) > 1:
        try:
            count = int(sys.argv[1])
        except ValueError:
            pass
    if len(sys.argv) > 2:
        start = sys.argv[2]
    if len(sys.argv) > 3:
        end = sys.argv[3]
    generate_commits(total_commits=count, start_date_str=start, end_date_str=end)

