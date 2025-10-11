<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\FetchTrendingDataJob;
use Illuminate\Console\Command;

final class FetchTrendingDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trending:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch trending data from various platforms';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting trending data fetch...');

        try {
            FetchTrendingDataJob::dispatch();
            $this->info('Trending data fetch job dispatched successfully!');
            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to dispatch trending data fetch job: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
