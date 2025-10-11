<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->comment('created by')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->json('media')->nullable();
            $table->dateTime('published_at');
            $table->boolean('is_picked_by_job')->default(false)->index();
            $table->string('post_type')->default('text')->comment('text, visual, video');
            $table->string('ai_tone')->nullable();
            $table->boolean('is_draft')->default(false);
            $table->json('platform_configs')->nullable()->comment('Platform-specific configurations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
