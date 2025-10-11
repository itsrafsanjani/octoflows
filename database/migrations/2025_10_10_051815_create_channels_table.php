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
        Schema::create('channels', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('platform_id')->comment('Facebook page ID or Twitter account ID etc.');
            $table->string('platform')->comment('facebook, twitter etc.');
            $table->string('type')->comment('page, group, account etc.');
            $table->string('name')->comment('Page/Group/Account name');
            $table->text('access_token');
            $table->dateTime('access_token_expires_at')->nullable();
            $table->text('access_token_secret')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channels');
    }
};
