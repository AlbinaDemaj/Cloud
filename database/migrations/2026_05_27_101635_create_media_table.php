<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();

            $table->foreignId('guest_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('company_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('file_type', ['photo', 'video']);
            $table->string('original_name');
            $table->string('file_path');
            $table->string('thumbnail_path')->nullable();

            $table->unsignedBigInteger('file_size');
            $table->string('mime_type');

            $table->boolean('is_visible')->default(true);
            $table->enum('uploaded_by', ['admin', 'company']);

            $table->timestamp('uploaded_at')->useCurrent();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};