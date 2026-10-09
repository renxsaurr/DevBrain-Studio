<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stacks', function (Blueprint $table) {
            $table->string('id', 80)->primary();
            $table->string('name', 48);
            $table->string('category', 32);
            $table->string('icon', 12)->nullable();
            $table->string('color', 16)->default('#c6f36b');
            $table->unsignedInteger('entries')->default(0);
            $table->longText('image')->nullable();
            $table->timestamps();
        });

        Schema::create('snippets', function (Blueprint $table) {
            $table->string('id', 80)->primary();
            $table->string('title', 100);
            $table->string('description', 300);
            $table->longText('code');
            $table->longText('image')->nullable();
            $table->date('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });

        Schema::create('snippet_stack', function (Blueprint $table) {
            $table->string('snippet_id', 80);
            $table->string('stack_id', 80);
            $table->primary(['snippet_id', 'stack_id']);
            $table->foreign('snippet_id')->references('id')->on('snippets')->cascadeOnDelete();
            $table->foreign('stack_id')->references('id')->on('stacks')->cascadeOnDelete();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('snippet_stack');
        Schema::dropIfExists('snippets');
        Schema::dropIfExists('stacks');
    }
};
