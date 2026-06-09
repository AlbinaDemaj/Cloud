<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folder_guest', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('folder_id');
            $table->unsignedBigInteger('guest_id');

            $table->timestamps();

            $table->unique(['folder_id', 'guest_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folder_guest');
    }
};