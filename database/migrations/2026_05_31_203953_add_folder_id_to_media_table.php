<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            if (!Schema::hasColumn('media', 'folder_id')) {
                $table->foreignId('folder_id')
                    ->nullable()
                    ->after('company_id')
                    ->constrained('folders')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            if (Schema::hasColumn('media', 'folder_id')) {
                $table->dropConstrainedForeignId('folder_id');
            }
        });
    }
};