/*
  # Add Click Count Increment Function

  ## Overview
  Creates a database function to atomically increment the click_count
  for a link when it's clicked, ensuring thread-safe updates.

  ## New Functions
  
  ### `increment_click_count`
  - Parameters: `link_id` (uuid)
  - Returns: void
  - Purpose: Atomically increments the click_count field in the links table
  
  ## Security
  - Function is accessible to all users (no auth required for public links)
  - Uses SECURITY DEFINER to execute with elevated privileges
*/

CREATE OR REPLACE FUNCTION increment_click_count(link_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE links
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$$;