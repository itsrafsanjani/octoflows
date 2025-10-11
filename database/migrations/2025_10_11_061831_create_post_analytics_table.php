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
        Schema::create('post_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('channel_id')->constrained()->onDelete('cascade');
            $table->string('platform');
            $table->string('platform_post_id')->nullable();
            $table->integer('impressions')->default(0);
            $table->integer('reach')->default(0);
            $table->integer('engagement')->default(0);
            $table->integer('likes')->default(0);
            $table->integer('shares')->default(0);
            $table->integer('comments')->default(0);
            $table->integer('clicks')->default(0);
            $table->integer('saves')->default(0);
            $table->decimal('engagement_rate', 5, 2)->default(0);
            $table->decimal('click_through_rate', 5, 2)->default(0);
            $table->timestamp('analytics_date');
            $table->timestamps();

            $table->unique(['post_id', 'channel_id', 'analytics_date']);
            $table->index(['platform', 'analytics_date']);
            $table->index(['analytics_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_analytics');
    }
};
