<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('viral_posts', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->nullable(); // Original post ID from platform
            $table->string('platform');
            $table->text('content');
            $table->string('author_username')->nullable();
            $table->string('author_name')->nullable();
            $table->integer('likes_count')->default(0);
            $table->integer('shares_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->integer('engagement_score')->default(0);
            $table->decimal('virality_score', 5, 2)->default(0);
            $table->json('hashtags')->nullable();
            $table->json('media_urls')->nullable();
            $table->json('metadata')->nullable(); // Additional platform-specific data
            $table->timestamp('published_at');
            $table->timestamp('discovered_at');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['platform', 'is_active', 'discovered_at']);
            $table->index(['virality_score', 'discovered_at']);
            $table->index(['engagement_score', 'discovered_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viral_posts');
    }
};
