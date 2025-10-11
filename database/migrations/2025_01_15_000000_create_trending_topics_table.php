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
        Schema::create('trending_topics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->string('platform')->nullable(); // twitter, instagram, facebook, etc.
            $table->integer('engagement_score')->default(0);
            $table->integer('mentions_count')->default(0);
            $table->decimal('growth_rate', 5, 2)->default(0);
            $table->json('metadata')->nullable(); // Additional data like sentiment, languages, etc.
            $table->timestamp('trending_since')->nullable();
            $table->timestamp('last_updated');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['platform', 'is_active', 'last_updated']);
            $table->index(['engagement_score', 'last_updated']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trending_topics');
    }
};
