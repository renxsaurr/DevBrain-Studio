<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkspaceController extends Controller
{
    public function show(): JsonResponse
    {
        if (DB::table('stacks')->count() === 0) {
            return response()->json(['data' => null]);
        }

        $snippetStacks = DB::table('snippet_stack')->get()->groupBy('snippet_id');
        $data = [
            'stacks' => DB::table('stacks')->orderBy('name')->get()->map(fn ($stack) => [
                'id' => $stack->id,
                'name' => $stack->name,
                'category' => $stack->category,
                'icon' => $stack->icon,
                'color' => $stack->color,
                'entries' => (int) $stack->entries,
                'image' => $stack->image,
            ])->values(),
            'snippets' => DB::table('snippets')->orderByDesc('created_at')->get()->map(fn ($snippet) => [
                'id' => $snippet->id,
                'title' => $snippet->title,
                'description' => $snippet->description,
                'code' => $snippet->code,
                'image' => $snippet->image,
                'createdAt' => $snippet->created_at,
                'stacks' => ($snippetStacks->get($snippet->id) ?? collect())->pluck('stack_id')->values(),
            ])->values(),
        ];

        return response()->json(['data' => $data]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'data' => ['required', 'array'],
            'data.stacks' => ['required', 'array', 'max:100'],
            'data.stacks.*.id' => ['required', 'string', 'max:80'],
            'data.stacks.*.name' => ['required', 'string', 'max:48'],
            'data.stacks.*.category' => ['required', 'string', 'max:32'],
            'data.stacks.*.icon' => ['nullable', 'string', 'max:12'],
            'data.stacks.*.color' => ['nullable', 'string', 'max:16'],
            'data.stacks.*.entries' => ['nullable', 'integer', 'min:0'],
            'data.stacks.*.image' => ['nullable', 'string'],
            'data.snippets' => ['required', 'array', 'max:500'],
            'data.snippets.*.id' => ['required', 'string', 'max:80'],
            'data.snippets.*.title' => ['required', 'string', 'max:100'],
            'data.snippets.*.description' => ['required', 'string', 'max:300'],
            'data.snippets.*.code' => ['required', 'string'],
            'data.snippets.*.image' => ['nullable', 'string'],
            'data.snippets.*.createdAt' => ['nullable', 'date'],
            'data.snippets.*.stacks' => ['nullable', 'array'],
            'data.snippets.*.stacks.*' => ['string', 'max:80'],
        ]);

        $data = $validated['data'];
        $now = now();
        $stackIds = collect($data['stacks'])->pluck('id')->all();
        DB::transaction(function () use ($data, $now, $stackIds): void {
            DB::table('snippet_stack')->delete();
            DB::table('snippets')->delete();
            DB::table('stacks')->delete();

            foreach ($data['stacks'] as $stack) {
                DB::table('stacks')->insert([
                    'id' => $stack['id'],
                    'name' => $stack['name'],
                    'category' => $stack['category'],
                    'icon' => $stack['icon'] ?? null,
                    'color' => $stack['color'] ?? '#c6f36b',
                    'entries' => $stack['entries'] ?? 0,
                    'image' => $stack['image'] ?? null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            foreach ($data['snippets'] as $snippet) {
                DB::table('snippets')->insert([
                    'id' => $snippet['id'],
                    'title' => $snippet['title'],
                    'description' => $snippet['description'],
                    'code' => $snippet['code'],
                    'image' => $snippet['image'] ?? null,
                    'created_at' => $snippet['createdAt'] ?? $now->toDateString(),
                    'updated_at' => $now,
                ]);

                foreach (array_intersect($snippet['stacks'] ?? [], $stackIds) as $stackId) {
                    DB::table('snippet_stack')->insert(['snippet_id' => $snippet['id'], 'stack_id' => $stackId]);
                }
            }

        });

        return response()->json(['saved' => true]);
    }
}
